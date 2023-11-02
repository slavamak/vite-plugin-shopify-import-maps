import type { Plugin, ResolvedConfig } from 'vite'
import type { PluginOptions } from './types'
import path from 'node:path'
import fs from 'node:fs/promises'

/**
 * Generates an import map file from a Vite bundle.
 */
export default function importMaps (options: PluginOptions): Plugin {
  const outDir = path.resolve(options.themeRoot, 'snippets')
  const importMapFile = path.join(outDir, options.snippetFile)

  let config: ResolvedConfig
  let moduleSpecifierMap: Map<string, string>

  return {
    name: 'vite-plugin-shopify-import-maps:import-maps',
    enforce: 'post',
    configResolved (resolvedConfig) {
      config = resolvedConfig
    },
    async buildStart ({ plugins }) {
      if (options.bareModules !== false) {
        const bareModulesPlugin = plugins.find((plugin) => plugin.name.includes('bare-modules'))
        if (bareModulesPlugin !== undefined) {
          moduleSpecifierMap = bareModulesPlugin.api.moduleSpecifierMap
        }
      }

      if (config.command === 'serve') {
        await fs.writeFile(
          importMapFile,
          ''
        )
      }
    },
    async writeBundle (_, bundle) {
      const importMap = new Map<string, string>()
      const modulePreloadTags: string[] = []

      let chunks: string[][]

      if (options.bareModules === false) {
        chunks = Object.entries(bundle)
          .filter(([_, chunk]) => chunk.type === 'chunk')
          .map(([fileName]) => [fileName, config.base + fileName])
      } else {
        chunks = Array.from(moduleSpecifierMap.entries())
      }

      const sortedChunks = chunks.sort((a, b) => a[1].localeCompare(b[1]))

      await Promise.allSettled(
        sortedChunks.map(async ([fileName, specifireKey]) => {
          importMap.set(specifireKey, `{{ '${fileName}' | asset_url }}`)

          if (options.bareModules === false) {
            importMap.set(`{{ '${fileName}' | asset_url | split: '?' | first }}`, `{{ '${fileName}' | asset_url }}`)
          }

          if (options.modulePreload) {
            modulePreloadTags.push(`<link rel="modulepreload" href="{{ '${fileName}' | asset_url }}">`)
          }
        })
      )

      const json = JSON.stringify({ imports: Object.fromEntries(importMap) }, null, 2)
      const scriptTag = `<script type="importmap">\n${json}\n</script>`
      const fileContents = options.modulePreload ? scriptTag + '\n\n' + modulePreloadTags.join('\n') : scriptTag

      await fs.writeFile(
        importMapFile,
        fileContents,
        { encoding: 'utf8' }
      )

      console.info(`[import-maps]: Successfully wrote to ${importMapFile}`)
    }
  }
}
