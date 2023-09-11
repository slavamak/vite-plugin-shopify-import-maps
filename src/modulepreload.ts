import type { Plugin } from 'vite'

const preloadMethod = '__vitePreload'
const preloadHelperId = '\0vite/preload-helper'

/**
 * Customizes the Vite module preload function to work with import-maps.
 * @see {@link https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importAnalysisBuild.ts Source code}
 */
export default function modulepreload (): Plugin {
  const preloadCode = `
    const assetsURL = ${assetsURL.toString()}
    const seen = {}
    export const ${preloadMethod} = ${preload.toString()}
  `

  return {
    name: 'vite-plugin-shopify-import-maps:modulepreload',
    apply: 'build',
    resolveId (id) {
      if (id === preloadHelperId) {
        return id
      }
    },
    load (id) {
      if (id === preloadHelperId) {
        return preloadCode
      }
    }
  }
}

const assetsURL = function (dep: string): string {
  const importmap = document.querySelector('[type=importmap]')

  if (importmap !== null) {
    const { imports }: { imports: Record<string, string> } = JSON.parse(importmap.innerHTML)
    const href: string | undefined = imports[dep]

    if (href !== undefined) {
      return href
    }
  }

  return dep
}

const seen: Record<string, boolean> = {}

function preload (baseModule: () => Promise<unknown>, deps: string[]): Promise<unknown> | undefined {
  if (deps === undefined || deps.length === 0) {
    return baseModule()
  }

  return Promise.all(
    deps.map(async (dep) => {
      const depUrl = assetsURL(dep)

      if (dep in seen) {
        return dep
      }

      seen[dep] = true

      const isCss = dep.endsWith('.css')
      const cssSelector = isCss ? '[rel="stylesheet"]' : ''
      const depLink = document.querySelector(`link[href="${depUrl}"]${cssSelector}`)

      if (depLink !== null) {
        return dep
      }

      const link = document.createElement('link')
      link.rel = isCss ? 'stylesheet' : 'modulepreload'

      if (!isCss) {
        link.as = 'script'
        link.crossOrigin = ''
      }

      link.href = depUrl

      document.head.appendChild(link)

      if (isCss) {
        return await new Promise((resolve, reject) => {
          link.addEventListener('load', resolve)
          link.addEventListener('error', () => { reject(new Error(`Unable to preload CSS for ${dep}`)) }
          )
        })
      }

      return dep
    })
  )
    .then(async () => await baseModule())
    .catch((err) => {
      const e = new Event('vite:preloadError', { cancelable: true })
      // @ts-expect-error custom payload
      e.payload = err
      window.dispatchEvent(e)
      if (!e.defaultPrevented) {
        throw err
      }
    })
}
