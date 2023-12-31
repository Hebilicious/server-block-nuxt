import { existsSync, promises as fsp } from "node:fs"
import { dirname } from "node:path"
import { createConsola } from "consola"
import { type ProxifiedModule, generateCode } from "magicast"
import { transform } from "esbuild"

const GENERATED_TEXT = "/** This file is auto-generated by the [server-block-nuxt] module. /!\\ Do not modify it manually ! */ \n" as const

export const SupportedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "CONNECT", "OPTIONS", "TRACE"] as const

export const logger = createConsola({
  defaults: {
    message: "[server-block-nuxt]"
  },
  level: process.env.NODE_ENV === "production" ? 4 : 3
})

export const makePathShortener = (source: string) => (path: string) => path.replace(source, "")

/**
 * Loaders
 * @todo this should be re-used accross modules or configurable
 */

const NITRO_LOADER_PREFIX = "_nitro/loader" as const

function getLoaderRoute(path: string) {
  const route = getRoute(path)
  // We don't want loaders to be prefixed with /api.
  const loaderRoute = route.startsWith("/api") ? route.slice(4) : route
  return `/${NITRO_LOADER_PREFIX}${loaderRoute}`
}

function getLoaderDestination(filePath: string, baseDirectory: string) {
  const route = getRoute(filePath)
  // We don't want loaders to be prefixed with /api.
  const loaderPath = route.startsWith("/api") ? route.slice(4) : route
  return `${baseDirectory}/.loader${loaderPath}.get.ts`
}

export function getRoute(path: string) {
  // logger.info("Finding route ...")
  const routeRegex = /server\/\.generated(.*?)\.ts/
  const matches = routeRegex.exec(path)
  // logger.info("getRoute", path)
  const route = matches?.[1]
  if (!route) throw new Error(`Could not parse action route from ${path}`)
  return route
}

function insertBeforeExtension(filePath: string, insertion: string) {
  // logger.info("Inserting", filePath, insertion)
  const lastDotIndex = filePath.lastIndexOf(".")
  return `${filePath.slice(0, lastDotIndex)}.${insertion}${filePath.slice(lastDotIndex)}`
}

async function writeFile(file: ProxifiedModule<any>, destination: string) {
  const { code } = generateCode(file)
  const shaked = await transform(code, { treeShaking: true, loader: "ts" }) // ...we clean it with esbuild ...
  if (!existsSync(dirname(destination))) await fsp.mkdir(dirname(destination), { recursive: true })
  await fsp.writeFile(destination, GENERATED_TEXT)
  await fsp.appendFile(destination, shaked.code)
}

export async function writeHandlers(file: ProxifiedModule<any>, path: string, baseDirectory: string) {
  // logger.info("Writing handlers ...", path)
  const writeMethodHandler = async (method: typeof SupportedMethods[number]) => {
    const destination = insertBeforeExtension(path, method.toLowerCase())
    file.exports.default = file.exports[method]
    delete file.exports[method] // @todo drop all other exports
    await writeFile(file, destination)
    return { method: method.toLowerCase(), route: getRoute(path), handler: destination }
  }
  const handlers = []
  // @todo use Promise.all
  for (const method of SupportedMethods) {
    if (file.exports[method]) {
      const handler = await writeMethodHandler(method)
      handlers.push(handler)
    }
  }

  // Extract loaders in .generated/.loader
  if (file.exports.loader) {
    const route = getLoaderRoute(path)
    const destination = getLoaderDestination(path, baseDirectory)
    file.exports.default = file.exports.loader
    delete file.exports.loader
    await writeFile(file, destination)
    handlers.push({ method: "get", route, handler: destination })
  }

  return handlers
}
