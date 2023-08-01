/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import { existsSync, promises as fsp } from "node:fs"
import { resolve as pathResolve } from "node:path"
import { addPlugin, createResolver, defineNuxtModule, useNitro } from "@nuxt/kit"
import ExtractSFCBlock from "@hebilicious/extract-sfc-block"

import { loadFile } from "magicast"
import { type NitroEventHandler, writeTypes } from "nitropack"
import { SupportedMethods, getRoute, logger, makePathShortener, writeHandlers } from "./utils"

async function* walkFiles(dir: string): AsyncGenerator<string> {
  const entries = await fsp.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const res = pathResolve(dir, entry.name)
    if (entry.isDirectory()) yield * walkFiles(res)
    else yield res
  }
}

const name = "server-block"

const serverOutput = "server/.generated" as const

export default defineNuxtModule({
  meta: {
    name,
    compatibility: { nuxt: ">=3.0.0" }
  },
  async setup(userOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const shortened = makePathShortener(nuxt.options.srcDir)

    logger.info(`Adding ${name} module...`)

    // 0. Create directories and .gitignore
    const serverGeneratedDirectoryPath = resolve(nuxt.options.srcDir, "server/.generated")
    if (existsSync(serverGeneratedDirectoryPath)) await fsp.rm(serverGeneratedDirectoryPath, { recursive: true })
    await fsp.mkdir(serverGeneratedDirectoryPath, { recursive: true })
    await fsp.writeFile(`${serverGeneratedDirectoryPath}/.gitignore`, "*")

    // 1. Add Volar plugin
    nuxt.options.typescript.tsConfig ||= {}
    // @ts-ignore TSconfig is wrong
    nuxt.options.typescript.tsConfig.vueCompilerOptions ||= {}
    // @ts-ignore TSconfig is wrong
    nuxt.options.typescript.tsConfig.vueCompilerOptions.plugins ||= []
    // @ts-ignore TSconfig is wrong
    nuxt.options.typescript.tsConfig.vueCompilerOptions.plugins.push("@hebilicious/sfc-server-volar")

    // 2. Add vite extract-sfc-block plugin
    nuxt.hook("vite:extendConfig", (config) => {
      config.plugins ||= []
      config.plugins.push(
        ExtractSFCBlock({
          output: serverOutput,
          sourceDir: "pages",
          blockType: "server",
          defaultPath: "api"
        })
      )
    })

    const allHandlers = new Map<string, NitroEventHandler>()

    const addHandlers = async (path: string, event?: string) => {
      if (!existsSync(path)) return // Return early if the path doesn't exist.
      if (path.includes(serverOutput)) {
        if (!path.endsWith(".ts")) return // skip non-ts files
        if (path.includes("server/.generated/.loader")) return // skip files in .loader
        if (SupportedMethods.map(m => `.${m.toLowerCase()}.ts`).some(s => path.includes(s))) return // skip .[method].ts
        logger.info(`[update] '@${event}'`, shortened(path))
        const route = getRoute(path) // This will throw if there's no generated handlers.
        const file = await loadFile(path)
        if (file) {
          logger.info(`[update]: Adding new handler(s) @${route}`)
          const handlers = await writeHandlers(file, path, serverGeneratedDirectoryPath)
          for (const handler of handlers) {
            logger.success(`[update] Wrote ${handler.method} handler @${handler.route} : ${shortened(handler.handler)}`)
            allHandlers.set(handler.handler, handler)
            if (useNitro().options.handlers.find(h => h.handler === handler.handler)) continue
            useNitro().options.handlers.push({ ...handler, lazy: true })
          }
        }
        // await useNuxt().hooks.callHookParallel("app:data:refresh") @todo find a way to refresh data here
        await writeTypes(useNitro()) // Write Nitro handler types for useFetch
        logger.info("[update]: Nitro Handlers \n", useNitro().options.handlers.map(h => h.route))
      }
    }

    // 3.Add handlers on build.
    nuxt.hook("build:before", async () => {
      for await (const loaderPath of walkFiles(serverGeneratedDirectoryPath))
        await addHandlers(loaderPath, "build:before")
    })

    // 4.Watch directories, split handlers and add them to Nitro/Nuxt
    nuxt.hook("builder:watch", async (event, path) => {
      try {
        await addHandlers(path, event)
      }
      catch (error) {
        logger.error(`error while handling '${event}'`, error)
      }
    })

    addPlugin(resolve("./runtime/plugin"))

    logger.success(`Added ${name} module successfully.`)
  }
})
