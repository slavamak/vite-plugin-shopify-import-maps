[![npm](https://img.shields.io/npm/v/vite-plugin-shopify-import-maps?color=brightgreen)](https://www.npmjs.com/package/vite-plugin-shopify-import-maps) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# vite-plugin-shopify-import-maps

The `vite-plugin-shopify-import-maps` enhances Shopify theme development by adding support for [import-maps](https://github.com/WICG/import-maps) which can be used to control the resolution of module specifiers.

## Requirements

Before using this plugin, make sure you have the [vite-plugin-shopify](https://github.com/barrel/shopify-vite/tree/main/packages/vite-plugin-shopify) installed. This plugin provides the necessary underlying setup for developing Shopify themes with Vite.

## Install

```bash
npm i vite-plugin-shopify-import-maps -D

# yarn
yarn add vite-plugin-shopify-import-maps -D

# pnpm
pnpm add vite-plugin-shopify-import-maps -D
```

## Usage

1. Add ES Module Shims [polyfill](https://github.com/guybedford/es-module-shims#usage) to the `<head>` tag in your `theme.liquid` file:

```liquid
<script src="{{ 'es-module-shims.js' | asset_url }}" async></script>
```

2. Render the `importmap` snippet file **before** performing any imports:

```liquid
<script src="{{ 'es-module-shims.js' | asset_url }}" async></script>

{% liquid
  render 'importmap'
  render 'vite-tag' with 'theme.js'
  render 'vite-tag' with 'customers.js'
%}
```

3. Add the `vite-plugin-shopify-import-maps` to your `vite.config.js` file:

```js
import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import importMaps from "vite-plugin-shopify-import-maps";

// Recommended configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name]-[hash].[ext]",
        minifyInternalExports: false,
      },
    },
  },
  plugins: [shopify({ versionNumbers: true }), importMaps()],
});
```

After executing the build command, the `importmap.liquid` file will be generated in the `snippets` folder in your theme root directory.

## Options

### themeRoot

- **Type:** `string`
- **Default:** `'./'`

Root path to your Shopify theme directory.

### snippetFile

- **Type:** `string`
- **Default:** `'importmap.liquid'`

Specifies the file name of the snippet that include import map.

## Trouble shooting

If you have any problems or have suggestions, welcome to [issues](https://github.com/slavamak/vite-plugin-shopify-import-maps/issues).

### Importing asset files (e.g. fonts, images) does not use the version parameter from Shopify CDN

This is not the scope of import map, as it is are designed to manage javascript modules.

A compromise for this might be to use hashed filenames for assets. See the `vite.config.js` file example above.

An alternative approach could be to load assets from Liquid files using the `asset_url` filter and consume them via CSS variables.

```liquid
{% #theme.liquid %}

{% style %}
  @font-face {
    font-family: 'Anton';
    src: url("{{ 'anton-v23-latin-regular.woff2' | asset_url }}") format('woff2');
    font-display: swap;
  }

  :root {
    --font-heading-family: 'Anton', sans-serif;
    --background-image: url('{{ 'background-image.svg' | asset_url }}');
  }
{% endstyle %}
```

```css
/* entrypoints/theme.css */

h1,
h2,
h3 {
  font-family: var(--font-heading-family);
}

body {
  background-image: var(--background-image);
}
```

## Acknowledges

- [vite-plugin-shopify](https://github.com/barrel/shopify-vite) - Shopify theme development using Vite
