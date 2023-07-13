# ⚗️ Server Block Nuxt

[![CI](https://github.com/Hebilicious/server-block-nuxt/actions/workflows/ci.yaml/badge.svg)](https://github.com/Hebilicious/server-block-nuxt/actions/workflows/ci.yaml)
[![npm version](https://badge.fury.io/js/@hebilicious%2Fserver-block-nuxt.svg)](https://badge.fury.io/js/@hebilicious%2Fserver-block-nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🚀 Welcome to __Server Block Nuxt__!  

_🧪 This module is experimental._

Nuxt Module that adds server block supports in your pages components.

```html
<server lang="ts"></server>
<script lang="ts" setup></script>
<template></template>
<style></style>
```

You can think of server block as a convenient way to write API handlers in your pages components.

<img width="1112" alt="image" src="https://github.com/Hebilicious/server-block-nuxt/assets/13395944/4051eefe-cd83-48cb-a08b-88c451988d10">

## 📦 Install

Install the module and the volar extension :

```bash
npm i -D @hebilicious/server-block-nuxt @hebilicious/sfc-server-volar
```

Add the module to your Nuxt config :

```ts
export default defineNuxtConfig({
  modules: [
    "@hebilicious/server-block-nuxt"
  ]
})
```

That's it !
The volar extension will be automatically installed by the nuxt module.

## 📖 Usage

- *Server blocks are only available in pages components.*

- *default exports are not available in server blocks. Use named exports.*

Add a server block in a page component :

```html
<server lang="ts">
const message = "Hello World!!!"
const bye = "bye!"
export const GET = defineEventHandler(() =>({ message }))
export const POST = defineEventHandler(() =>({ message: bye }))
</server>

<script setup lang="ts">
const { data } = useFetch("/api/message")
</script>

<template>
  <div> Hello Message, {{ data }} </div>
</template>
```

This will generate 2 handlers in `server/.generated/api` :

- GET : `server/.generated/api/message.get.ts`
- POST : `server/.generated/api/message.post.ts`

All HTTP methods are supported.

### Custom route

You can override the default route convention with the `path` attribute  :

```html
<server lang="ts" path="/not-api/this/is/cool">
export const GET = defineEventHandler((event) => {
  return "We're here now."
})
</server>

<script setup lang="ts">
const { data } = useFetch("/not-api/this/is/cool")
</script>

<template>
  <h1>Hello</h1>
  <div> {{ data }} </div>
</template>
```

This will generate a get handler: `server/.generated/not-api/this/is/cool.get.ts`.

A `.gitignore` file will be generated for you. Do not commit the generated files in your repository.


## FAQ 

**Why `<server>` and not `<script server>` ?**

- `<script server>` causes issues with the current behaviour of additional script tags in SFCs (notably with import/exports)
- `<server>` blocks are completely removed from the SFC and don't interfere with `<template>` or `<script>`, they create a clear boundary.
- The syntax highlighting work in environments that uses the lang attribute. I would like github support too.

## TODO

- [ ] Support multiple server blocks in a single file
- [ ] Integrates with form-actions & loaders
- [ ] Add useFetch typings

## Contributing 

Feedback, issues and PRs are welcomed.
