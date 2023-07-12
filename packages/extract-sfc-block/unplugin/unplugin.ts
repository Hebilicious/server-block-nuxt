// import { type ResolvedConfig } from "vite"
// import { createUnplugin } from "unplugin"
// import createCache from "../src/cache"
// import type { PluginConfig } from "../src/utils"
// import { pluginName } from "../src/utils"

// /**
//  * WIP
//  */
// const unplugin = createUnplugin((pluginConfig: PluginConfig) => {
//   let config: ResolvedConfig
//   let cache: ReturnType<typeof createCache>

//   return {
//     name: `unplugin-${pluginName}`,
//     vite: {
//       configResolved(resolvedConfig) {
//         // logger.info("Resolved config !")
//         config = resolvedConfig
//       },
//       buildStart() {
//         // logger.info("Starting build")
//         cache = createCache(config)
//       }
//     }

//     // load(id) {

//     // }

//     // transform(code, id) {

//     // }

//     // async handleHotUpdate({ modules, read, file, server }) {
//     // }
//   }
// })

// export default unplugin
