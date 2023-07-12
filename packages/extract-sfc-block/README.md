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
  blockType: "server", // This will match <server></server> blocks.
  defaultPath: "api" // This will be only be used if no path attribute is provided.
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

This plugin will create a `[output]/[defaultPath]/hello.ts` file:

```ts
const message = "Hello World!!!"
```

The file extension will use the lang attribute, or default to `.ts`.

### Custom Path

You can customize the output path at the block level:

```html
<server lang="ts" path="somewhere/else/another-message">
const message = "Hello World!!!"
</server>
<template>
  <div> This is a template.</div>
</template>
```

This plugin will create a `somewhere/else/another-message.ts` file:

```ts
const message = "Hello World!!!"
```

## TODO

- [ ] Support multiple server blocks in a single file.
- [ ] Refactor to unplugin.
- [ ] Write tests
- [ ] Write docs
