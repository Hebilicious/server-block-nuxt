import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: ["src/index"],
  externals: [
    "@vue/language-core"
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  },
  failOnWarn: false
})
