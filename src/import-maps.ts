import type { Plugin, ResolvedConfig } from 'vite'
import path from 'node:path'
import fs from 'node:fs/promises'
import type { PluginOptions } from './types'

/**
 * Generates an importmap file from a Vite bundle.
 * @param {Object} options - The plugin options.
 * @property {string} options.filename - The name of the importmap file.
 * @property {string} options.outDir - The output directory for the importmap file.
 */
export default function importMaps (options: PluginOptions | undefined): Plugin {
  const defaultFilename = 'importmap.liquid'
  const filename = options?.filename ?? defaultFilename

  let config: ResolvedConfig

  return {
    name: 'vite-plugin-shopify-import-maps:import-maps',
    apply: 'build',
    enforce: 'post',
    configResolved (resolvedConfig) {
      config = resolvedConfig
    },
    async writeBundle (_, bundle) {
      const outDir = path.resolve(options?.outDir ?? './snippets')
      const importMapFile = path.join(outDir, filename)
      const importMap = new Map<string, string>()

      await Promise.allSettled(
        Object.keys(bundle).map(async (fileName) => {
          if (fileName.endsWith('manifest.json')) {
            return
          }

          importMap.set(`${config.base}${fileName}`, `{{ '${fileName}' | asset_url }}`)
        })
      )

      const json = JSON.stringify({ imports: Object.fromEntries(importMap) }, null, 2)

      await fs.writeFile(
        importMapFile,
        `<base href="{{ 'base' | asset_url | split: 'base' | first }}">\n<script type="importmap">\n${json}\n</script>`,
        { encoding: 'utf8' }
      )

      console.info(`[import-maps]: Successfully wrote to ${importMapFile}`)
    }
  }
}
