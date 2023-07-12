import { existsSync, promises as fsp } from "node:fs"

import { addServerHandler, createResolver, defineNuxtModule, useNitro } from "@nuxt/kit"
import ExtractSFCBlock from "@hebilicious/extract-sfc-block"

import { loadFile } from "magicast"
import type { NitroEventHandler } from "nitropack"
import { SupportedMethods, getRoute, logger, makePathShortener, writeHandlers } from "./runtime/utils"

const name = "server-block"

const serverOutput = "server/.generated" as const

export default defineNuxtModule({
  meta: {
    name,
    compatibility: {
      nuxt: ">=3.0.0"
    }
  },
  async setup(userOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const shortened = makePathShortener(nuxt.options.srcDir)

    logger.info(`Adding ${name} module...`)

    // 0. Create directories and .gitignore
    const serverGeneratedDirectoryPath = resolve(nuxt.options.srcDir, "server/.generated")
    if (!existsSync(serverGeneratedDirectoryPath)) await fsp.mkdir(serverGeneratedDirectoryPath)
    await fsp.writeFile(`${serverGeneratedDirectoryPath}/.gitignore`, "*")

    // 1. Add Volar plugin
    nuxt.options.typescript.tsConfig ||= {}
    nuxt.options.typescript.tsConfig.vueCompilerOptions ||= {}
    nuxt.options.typescript.tsConfig.vueCompilerOptions.plugins ||= []
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

    // 3.Watch directories, split handlers and add them to Nitro/Nuxt
    const allHandlers = new Map<string, NitroEventHandler>()
    nuxt.hook("builder:watch", async (event, path) => {
      try {
        if (!existsSync(path)) return // Return early if the path doesn't exist.
        if (path.includes(serverOutput)) {
          if (!path.endsWith(".ts")) return // skip non-ts files
          if (SupportedMethods.map(m => `.${m.toLowerCase()}.ts`).some(s => path.includes(s))) return // skip .[method].ts
          logger.info(`[update] '@${event}'`, shortened(path))
          const route = getRoute(path) // This will throw if there's no generated handlers.
          const file = await loadFile(path)
          if (file) {
            logger.info(`[update]: Adding new handler(s) @${route}`)
            const handlers = await writeHandlers(file, path)
            for (const handler of handlers) {
              logger.success(`[update] Wrote ${handler.method} handler @${handler.route} : ${shortened(handler.handler)}`)
              allHandlers.set(handler.handler, handler)
              if (!nuxt.options.serverHandlers.some(h => h.handler === handler.handler)) {
                addServerHandler({ ...handler, lazy: true })
                logger.success(`[update] Nuxt handler updated : ${handler.route}`)
              }
            }
            for (const [path, handler] of allHandlers.entries()) {
              if (useNitro().scannedHandlers.find(h => h.handler === path)) continue
              useNitro().scannedHandlers.push({ ...handler, lazy: true })
            }
          }
          logger.info("[update]: Nitro Handlers \n", useNitro().scannedHandlers.map(h => h.handler))
          logger.info("[update]: Nuxt Handlers \n", nuxt.options.serverHandlers.map(h => h.handler))
        }
      }
      catch (error) {
        logger.error(`error while handling '${event}'`, error)
      }
    })

    logger.success(`Added ${name} module successfully.`)
  }
})
