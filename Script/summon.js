import { build } from "esbuild"


// An esbuild file that includes a specific subset of the files in the entire project to create a bundle that is deployed in the browser Roots specified by `Module/path.js` must be modified to a more complete relative path for tersness

const esbuildConfig = {
  "entryPoints": [
    "./dist/Witch/Whalebone.js",
  ],
  "outfile": "./dist/Data/Public/bundle.js",
  "bundle": true,
  "minify": false,
  "sourcemap": true
}

// Execute the build
build(esbuildConfig).catch(() => process.exit(1))
