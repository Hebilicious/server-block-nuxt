// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "../packages/server-block-nuxt/src/module"
    // "@example/server-block-nuxt"
  ],
  devtools: {
    enabled: true
  },
  experimental: {
    renderJsonPayloads: true
  }
})
