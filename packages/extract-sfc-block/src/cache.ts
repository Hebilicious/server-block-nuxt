/* eslint-disable import/no-duplicates */
import fs from "node:fs"
import { createRequire } from "node:module"

import type { ResolvedConfig } from "vite"
import type * as _compiler from "vue/compiler-sfc"
import type { SFCDescriptor } from "vue/compiler-sfc"

export default function createCache(config: ResolvedConfig) {
  const sfcCache = new Map<string, SFCDescriptor>()
  const compiler = resolveCompiler(config.root)

  return {
    getSFC(filename: string) {
      if (!sfcCache.has(filename)) {
        const { descriptor, errors } = compiler.parse(
          fs.readFileSync(filename, "utf8").toString(),
          {
            filename,
            sourceMap:
              config.command === "build" ? !!config.build.sourcemap : true,
            sourceRoot: config.root
          }
        )
        if (errors.length > 0) {
          throw errors[0]
        }
        sfcCache.set(filename, descriptor)
      }
      return sfcCache.get(filename)!
    },
    updateCodeSFC(filename: string, code: string) {
      const { descriptor, errors } = compiler.parse(code, { filename })
      if (errors.length > 0) {
        throw errors[0]
      }
      sfcCache.set(filename, descriptor)
      return descriptor
    },
    hasFile(filename: string) {
      return sfcCache.has(filename)
    }
  }
}

export type CompilerSfc = typeof _compiler

export function resolveCompiler(root: string): CompilerSfc {
  // resolve from project root first, then fallback to peer dep (if any)
  const compiler = tryResolveCompiler(root) || tryResolveCompiler()
  if (!compiler) {
    throw new Error(
      "Failed to resolve vue/compiler-sfc.\n"
        + "@vitejs/plugin-vue requires vue (>=3.2.25) "
        + "to be present in the dependency tree."
    )
  }

  return compiler
}

function tryResolveCompiler(root?: string) {
  const vueMeta = tryRequire("vue/package.json", root)
  // make sure to check the version is 3+ since 2.7 now also has vue/compiler-sfc
  if (vueMeta && vueMeta.version.split(".")[0] >= 3) {
    return tryRequire("vue/compiler-sfc", root)
  }
}

const _require = createRequire(import.meta.url)
function tryRequire(id: string, from?: string) {
  try {
    return from
      ? _require(_require.resolve(id, { paths: [from] }))
      : _require(id)
  }
  catch {
    // ignore
  }
}
