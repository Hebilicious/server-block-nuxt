# ⚗️ Server Block Nuxt

[![CI](https://github.com/Hebilicious/server-block-nuxt/actions/workflows/ci.yaml/badge.svg)](https://github.com/Hebilicious/server-block-nuxt/actions/workflows/ci.yaml)
[![npm version](https://badge.fury.io/js/@hebilicious%2Fauthjs-nuxt.svg)](https://badge.fury.io/js/@hebilicious%2Fauthjs-nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🚀 Welcome to __Server Block Nuxt__!  

This is a Nuxt Module that allows you to use the <server></server> syntax.

## ⚠️ Disclaimer

_🧪 This module is experimental._

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

*Server blocks are only available in pages components.*
*You can't use default exports in server blocks.*

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

A `.gitignore` file will be generated for you. Do not commit the generated files in your repository.