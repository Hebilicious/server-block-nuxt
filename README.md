# ⚗️ Server Block Nuxt

[![CI](https://github.com/Hebilicious/server-block-nuxt/actions/workflows/ci.yaml/badge.svg)](https://github.com/Hebilicious/server-block-nuxt/actions/workflows/ci.yaml)
[![npm version](https://badge.fury.io/js/@hebilicious%2Fserver-block-nuxt.svg)](https://badge.fury.io/js/@hebilicious%2Fserver-block-nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🚀 Welcome to __Server Block Nuxt__!  

_🧪 This module is experimental._
Nuxt Module that allows you to use the `<server lang="ts"></server>` blocks in your pages components.
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

- *You can't use default exports in server blocks.*

Add a server block in a pages component :

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

You can override the default destination  :

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

A `.gitignore` file will be generated for you. Do not commit the generated files in your repository.
