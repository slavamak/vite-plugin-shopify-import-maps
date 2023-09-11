import type { Plugin } from 'vite'

/**
 * Removes trailing slashes from import statements in bundle chunks.
 * This is necessary for the browser to correctly resolve Vite dynamic import.
 * @see {@link https://vitejs.dev/guide/features.html#dynamic-import Dynamic Import}
 */
export default function transform (): Plugin {
  return {
    name: 'vite-plugin-shopify-import-maps:transform',
    generateBundle: {
      order: 'post',
      async handler (_, bundle) {
        for (const fileName in bundle) {
          const chunk = bundle[fileName]
          if (chunk.type === 'chunk') {
            chunk.code = chunk.code.replaceAll('./', '')
          }
        }
      }
    }
  }
}
