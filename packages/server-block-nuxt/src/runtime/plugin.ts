export default defineNuxtPlugin(async (nuxt) => {
  // @todo this may need to be fixed in Nuxt
  nuxt.hook("app:suspense:resolve", async () => {
    await nuxt.callHook("app:data:refresh")
    // eslint-disable-next-line no-console
    console.log("[server-block-nuxt] data successfully loaded")
  })
})
