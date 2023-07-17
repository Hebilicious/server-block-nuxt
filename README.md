# Server Block Nuxt

[![CI](https://github.com/Hebilicious/server-block-nuxt/actions/workflows/ci.yaml/badge.svg)](https://github.com/Hebilicious/server-block-nuxt/actions/workflows/ci.yaml)
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

[npm-version-src]: https://img.shields.io/npm/v/@hebilicious/server-block-nuxt/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@hebilicious/server-block-nuxt
[npm-downloads-src]: https://img.shields.io/npm/dt/@hebilicious/server-block-nuxt.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@hebilicious/server-block-nuxt
[license-src]: https://img.shields.io/npm/l/@hebilicious/server-block-nuxt.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@hebilicious/server-block-nuxt
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com

<img width="1000" alt="image" src="https://github.com/Hebilicious/server-block-nuxt/assets/13395944/4051eefe-cd83-48cb-a08b-88c451988d10">

## 🚀 Welcome to __Server Block Nuxt__!

_🧪 This module is experimental 🧪_

Nuxt Module that adds server block supports in your pages components.

```html
<server lang="ts"></server>
<script lang="ts" setup></script>
<template></template>
<style></style>
```

You can think of server block as a convenient way to write API handlers in your pages components.

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

## ⚗ Troubleshooting

While developing your application, you might encounter a `Page Not Found` error while hitting your extracted server handlers.
To fix this, you can delete the vite cache (usually in `node_modules/.cache/vite`). 
If you need more help, feel free to open an issue.

## 💡 FAQ

**Why `<server>` and not `<script server>` ?**

- `<script server>` causes issues with the current behaviour of additional script tags in SFCs (notably with import/exports)
- `<server>` blocks are completely removed from the SFC and don't interfere with `<template>` or `<script>`, they create a clear boundary.
- The syntax highlighting work in environments that uses the lang attribute. I would like github support too.

**Why no `defineServerProps` or loaders ?**

You can combine this with another library such as https://github.com/Hebilicious/form-actions-nuxt if you want to use form actions and loaders.

## 📝 TODO

- [x] Integrates with form-actions & loaders
- [ ] Support multiple server blocks in a single file
- [ ] Add useFetch typings

## 🫴 Contributing

Feedback, issues and PRs are welcomed.
