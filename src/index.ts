import type { Plugin } from 'vite'
import preloadHelper from './preload-helper'
import importMaps from './import-maps'
import type { PluginOptions } from './types'

/**
 * The Vite plugin enhances Shopify themes by adding support for import maps,
 * which can be used to control the resolution of module specifiers.
 * @see {@link https://github.com/slavamak/vite-plugin-shopify-import-maps GitHub}
 */
const vitePluginShopifyImportMaps = (options: PluginOptions): Plugin[] => {
  const plugins = [
    preloadHelper(),
    importMaps(options)
  ]

  return plugins
}

export default vitePluginShopifyImportMaps
