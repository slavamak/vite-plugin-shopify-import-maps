import type { Plugin } from 'vite'
import type { BareModules, PluginOptions } from './types'
import preloadHelper from './preload-helper'
import importMaps from './import-maps'
import bareModules from './bare-modules'

/**
 * The Vite plugin enhances Shopify themes by adding support for import maps,
 * which can be used to control the resolution of module specifiers.
 * @see {@link https://github.com/slavamak/vite-plugin-shopify-import-maps GitHub}
 * @param {Object} options - The plugin options.
 * @property {string} options.snippetFile - Specifies the file name of the snippet that include import map.
 * @property {string} options.themeRoot - Root path to your Shopify theme directory.
 * @property {boolean | BareModules} options.bareModules - Specifies whether to use bare modules or not, and define remapping groups for them.
 */
const vitePluginShopifyImportMaps = (userOptions?: PluginOptions): Plugin[] => {
  const {
    snippetFile = 'importmap.liquid',
    themeRoot = './',
    bareModules: bareModulesOption = false
  } = userOptions ?? {}

  const plugins = [
    preloadHelper(),
    importMaps({ snippetFile, themeRoot, bareModules: bareModulesOption })
  ]

  if (bareModulesOption !== false) {
    plugins.push(bareModules({
      snippetFile,
      themeRoot,
      bareModules: { ...{ defaultGroup: 'main', groups: {} }, ...(bareModulesOption as BareModules) }
    }))
  }

  return plugins
}

export default vitePluginShopifyImportMaps
