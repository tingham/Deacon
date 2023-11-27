import { readdirSync, readFileSync, mkdirSync, writeFileSync, write } from 'fs'
import { join } from 'path'
import ejs from "ejs"
import { WHALE_ROOT } from '../dist/Witch/Whalebone.js'

const STARTING_DIRECTORY = join(process.cwd(), 'Data', 'Templates')
const WRITE_TO_DIRECTORY = join(process.cwd(), 'dist', 'Data', 'Public')


// Compiles templates from `${ProjectRoot}/Data/Templates` into a map of template names to render functions
function BuildTemplateRenderers(atPath = STARTING_DIRECTORY, withMap = {}) {
  for (const dir of readdirSync(atPath)) {
    let localFilepath = `${atPath}/${dir}`
    if (localFilepath.endsWith(".ejs")) {
      let Filepath = NormalizePath(localFilepath)
      let Content = readFileSync(localFilepath, 'utf8')
      // Not included an includer callback here; hopefully ejs uses fs.readFile under the hood
      let Render = ejs.compile(Content, { async: true, client: true }).toString()
      withMap[Filepath] = { Filepath: localFilepath, Content, Render }
    } else if (localFilepath.length > 2) {
      // If the directory is not a file, recurse
      BuildTemplateRenderers(localFilepath, withMap)
    }
  }
}

function WriteTemplateMap(mmap) {
  let outpath = `${WRITE_TO_DIRECTORY}/Templates.json`
  try {
    mkdirSync(WRITE_TO_DIRECTORY, { recursive: true })
  } catch (error) { }
  writeFileSync(outpath, JSON.stringify(mmap, null, 2), { encoding: 'utf8' })
}

function NormalizePath(pathPart) {
  // Lop off the starting directory
  let result = pathPart.replace(STARTING_DIRECTORY, WHALE_ROOT)

  // Remove double backslashes
  result = result.toString().replace(/\\/g, '/')

  return result
}

const toSingleSlashes = (strs, ...args) =>
  strs.reduce((a, v, i) =>
    a.concat(args[i - 1] || ``).concat(v, ``), ``)
    .replace(/(\\|\/){2,}/g, (a, b) => b);

// If executing this file directly, run the test suite
(async () => {
  let mmap = {}
  await BuildTemplateRenderers(STARTING_DIRECTORY, mmap)
  await WriteTemplateMap(mmap)
})()
