# Extract SFC Server

Extract custom blocks from `.vue` files.

## Install

```bash
npm i -D @hebilicious/extract-sfc-block
```

## Usage

Add to your vite configuration :

```ts
import ExtractSFCBlock from "@hebilicious/extract-sfc-block"

const VitePlugin = ExtractSFCBlock({
  output: "server/.generated", // This is relative to the vite config directory.
  sourceDir: "pages", // This is relative to the vite config directory.
  blockType: "server" // This will match <server></server> blocks.
})
```

With a SFC `[sourceDir]/hello.vue` :

```html
<server lang="ts">
const message = "Hello World!!!"
</server>
<template>
  <div> This is a template.</div>
</template>
```

This plugin will create a `output/hello.ts` file:

//
```ts
const message = "Hello World!!!"
```

The file extension will use the lang attribute, or default to `.ts`.
