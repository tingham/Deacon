const { build } = require("esbuild")
const esbuildPluginTsc = require("esbuild-plugin-tsc")

async function esBuildWrapper () {
  try {
    let result = await build({
      entryPoints: ["./Main.ts"],
      entryNames: "deacon-client.bundle",
      bundle: true,
      sourcemap: "inline",
      outdir: "./dist",
      format: "esm",
      external: ["fs", "path", "stream", "assert", "crypto", "os", "url", "util"],
      // Add the tsc plugin for files in the ./Library/Data/Model directory
      plugins: [
          esbuildPluginTsc({
            tsconfigPath: "./tsconfig.json",
            include: [
              // /(\\|\/)Library(\\|\/)Data(\\|\/)Model(\\|\/).*.ts/
            ]
          })
      ]
    })
    if (result.errors.length > 0) {
      throw result.errors[0]
    }
    console.log("Build complete")
  } catch (e) {
    console.error(e)
  }
}

module.exports = esBuildWrapper