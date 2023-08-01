import path from "node:path"
import { existsSync, mkdirSync, writeFileSync } from "node:fs"

import type { PluginOption, ResolvedConfig } from "vite"
import type { SFCBlock } from "vue/compiler-sfc"

import createCache from "./cache"
import type { PluginConfig } from "./utils"
import { GENERATED_TEXT, getExtractionInfo, logger, parseVueRequest, pluginName } from "./utils"

export default function vueExtractSFCServer(pluginConfig: PluginConfig): PluginOption {
  const findBlockType = (block: SFCBlock) => block.type === pluginConfig.blockType
  let config: ResolvedConfig
  let cache: ReturnType<typeof createCache>
  return {
    name: `vite:${pluginName}`,

    configResolved(resolvedConfig) {
      // logger.info("Resolved config !")
      config = resolvedConfig
    },

    buildStart() {
      // logger.info("Starting build")
      cache = createCache(config)
    },
    load(id) {
      // Only match vue files
      const match = id.match(/^(.*)\/([^/]+)\.vue$/)
      if (!match) return
      let filename = id
      if (!filename.startsWith(config.root))
        filename = path.resolve(config.root, filename)

      const sfc = cache.getSFC(filename)
      const extractBlock = sfc.customBlocks.find(findBlockType)
      if (extractBlock) {
        logger.info(`Extracting block @ ${filename}`)
        // logger.info(extractBlock.content)
        const { outputDirectory, outputPath } = getExtractionInfo(config.root, filename, pluginConfig, extractBlock)
        if (outputDirectory && !existsSync(outputDirectory)) mkdirSync(outputDirectory, { recursive: true })
        if (outputPath) {
          writeFileSync(outputPath, `${GENERATED_TEXT}${extractBlock.content}`)
          logger.success("Generated file: ", outputPath)
        }
      }
    },

    transform(code, id) {
      const request = parseVueRequest(id)
      if (request.query.type === pluginConfig.blockType) {
        logger.info(`Transforming "${pluginConfig.blockType}" block...`)
        return {
          code: "export default {}",
          map: { mappings: "" }
        }
      }
    },

    async handleHotUpdate({ modules, read, file, server }) {
      if (!cache.hasFile(file)) return modules

      logger.info("Cache hit !", file)
      const serverModules = new Set(
        modules.filter(m => m.url.includes(`&type=${pluginConfig.blockType}&`))
      )
      const sfc = cache.getSFC(file)
      const extractBlock = sfc.customBlocks.find(findBlockType)
      if (extractBlock) {
        const { outputPath } = getExtractionInfo(config.root, file, pluginConfig, extractBlock)
        if (outputPath) {
          const newSFC = cache.updateCodeSFC(file, await read())
          writeFileSync(outputPath, `${GENERATED_TEXT}${newSFC.customBlocks.find(findBlockType)?.content}`)
          logger.success("Updated file", outputPath)
          const mainModule = server.moduleGraph.getModuleById(file)
          if (mainModule) {
            serverModules.add(mainModule)
            logger.success("Updated module", mainModule.url)
          }
        }
        return [...serverModules]
      }
    }
  }
}
