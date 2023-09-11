[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# vite-plugin-shopify-import-maps
The `vite-plugin-shopify-import-maps` plugin enhances Shopify themes by adding support for [import-maps](https://github.com/WICG/import-maps) to resolve assets.

## Usage

Add the `vite-plugin-shopify-import-maps` to your `vite.config.js` file:

```js
import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import importMaps from 'vite-plugin-shopify-import-maps'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  plugins: [shopify(), importMaps()],
})
```

By default, the plugin generates an `importmap.liquid` file in the snippets directory in the project root. However, you can customize this behavior by passing the options object to the plugin. For example:

```js
export default defineConfig({
  // ... vite options
  plugins: [
    shopify({
      themeRoot: './theme',
    }),
    importMaps({
      filename: 'theme-importmap.liquid',
      outDir: './theme/snippets',
    })
  ],
})
```

> [!IMPORTANT]
> All major browsers now support import maps, but to ensure compatibility with a [wider range of users](https://caniuse.com/import-maps), it is recommended to add a polyfill to your `theme.liquid` file. You can learn more about adding the polyfill [here](https://github.com/guybedford/es-module-shims#usage).

## Acknowledges
- [shopify-vite](https://github.com/barrel/shopify-vite/) - Shopify theme development using Vite
- [asset-mapper](https://github.com/KonnorRogers/asset-mapper) - Mapping JS bundles to manifests
