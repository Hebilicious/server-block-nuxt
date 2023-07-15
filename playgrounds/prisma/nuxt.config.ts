// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "../../packages/server-block-nuxt/src/module"
  ],
  devtools: { enabled: true }
})
