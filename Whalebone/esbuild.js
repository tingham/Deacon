import esbuild from "esbuild"

let buildConfig = {
  "entryPoints": ["./Source/Whalebone.ts"],
  "outfile": "../dist/Data/Public/bundle.js",
  "format": "esm",
  "bundle": true,
  "minify": false,
  "sourcemap": true
}

esbuild.build(buildConfig).catch(() => process.exit(1))