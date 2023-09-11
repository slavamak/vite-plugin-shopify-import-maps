import type { Plugin } from 'vite'
import modulepreload from './modulepreload'
import transform from './transform'
import importmaps from './import-maps'
import type { PluginOptions } from './types'

/**
 * Vite plugin for developing Shopify themes with import-maps.
 * @see {@link https://github.com/slavamak/vite-plugin-shopify-import-maps GitHub}
 */
const vitePluginShopifyImportMaps = (options: PluginOptions): Plugin[] => {
  const plugins = [
    modulepreload(),
    transform(),
    importmaps(options)
  ]

  return plugins
}

export default vitePluginShopifyImportMaps
