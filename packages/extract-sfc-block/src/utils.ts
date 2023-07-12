import path from "node:path"
import { createConsola } from "consola"
import type { VueQuery } from "@vitejs/plugin-vue"
import {
  parseVueRequest as _parseVueRequest
} from "@vitejs/plugin-vue"
import { camelize, capitalize } from "@vue/shared"

export interface PluginConfig {
  output: string
  sourceDir: string
  blockType: string
}
export const pluginName = "extract-sfc-block" as const
export const GENERATED_TEXT = `/** This file is auto-generated by the [${pluginName}] plugin. /!\\ Do not modify it manually ! */ \n` as const

export const logger = createConsola({
  defaults: {
    message: `[${pluginName}]`
  },
  level: process.env.NODE_ENV === "production" ? 4 : 3
})

export function pascalCase(str: string) {
  return capitalize(camelize(str))
}

export function parseVueRequest(id: string) {
  return _parseVueRequest(id) as {
    filename: string
    query: Omit<VueQuery, "type"> & {
      name?: string
      type: VueQuery["type"] | string // This can be the PluginConfig.blockType
    }
  }
}

// For a [name].vue file, returns name
function extractVueFileName(str: string, dir: string) {
  return str.startsWith(dir) ? str.split(dir)[1].slice(0, -4) : null
}

export function getExtractionInfo(root: string, file: string, pluginOptions: any, lang = "ts") {
  const directoryPath = path.resolve(root, pluginOptions.output)
  const sourceDirectory = `${root}/${pluginOptions.sourceDir}/`
  const vueFileName = extractVueFileName(file, sourceDirectory)
  const outputPath = vueFileName ? `${directoryPath}/${vueFileName}.${lang}` : null
  // console.log({ vueFileName, sourceDirectory, file, directoryPath, outputPath })
  return {
    outputDirectory: outputPath ? path.dirname(outputPath) : null,
    outputPath
  }
}