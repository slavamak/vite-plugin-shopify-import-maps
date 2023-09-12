import type { Plugin } from 'vite'
import preloadHelper from './preload-helper'
import importmaps from './import-maps'
import type { PluginOptions } from './types'

/**
 * Vite plugin for developing Shopify themes with import-maps.
 * @see {@link https://github.com/slavamak/vite-plugin-shopify-import-maps GitHub}
 */
const vitePluginShopifyImportMaps = (options: PluginOptions): Plugin[] => {
  const plugins = [
    preloadHelper(),
    importmaps(options)
  ]

  return plugins
}

export default vitePluginShopifyImportMaps
