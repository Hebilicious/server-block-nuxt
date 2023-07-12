import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: ["src/index"],
  externals: [
    "vite",
    "@vue/compiler-sfc"
    // "vue/compiler-sfc"
    // "@volar/vue-language-core"
    // "@vue/shared"
    // "@vitejs/plugin-vue"
    // "consola"
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  },
  failOnWarn: false
})
