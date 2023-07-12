import type { VueLanguagePlugin } from "@vue/language-core"

const plugin: VueLanguagePlugin = () => {
  return {
    name: "sfc-server-volar",
    version: 1,
    resolveEmbeddedFile(fileName, sfc, embeddedFile) {
      if (embeddedFile.fileName.replace(fileName, "").match(/^\.(js|ts|jsx|tsx)$/)) {
        for (const block of sfc.customBlocks) {
          const content = embeddedFile.content
          if (block.type === "server") {
            content.push([
              block.content, // text to add
              block.name, // source
              0, // content offset in source
              {
                // language capabilities to enable in this segment
                hover: true,
                references: true,
                definition: true,
                diagnostic: true,
                rename: true,
                completion: true,
                semanticTokens: true
              }
            ])
          }
        }
      }
    }
  }
}

export default plugin
