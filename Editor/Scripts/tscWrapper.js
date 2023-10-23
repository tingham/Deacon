const util = require("util")
const exec = util.promisify(require("child_process").exec)
const typescript = require("typescript")
const tsconfig = {
  noEmit: true,
  target: typescript.ScriptTarget.ES2020,
  moduleResolution: typescript.ModuleResolutionKind.NodeJs,
  strict: true
}
// A method that uses typescript to compile ../tsconfig.json without emitting any files
function tscSync() {
  let program = typescript.createProgram(["./Main.ts"], tsconfig)
  let emitResult = program.emit()
  let preEmitDiagnostics = typescript.getPreEmitDiagnostics(program)
  let allDiagnostics = typescript.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
      let message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      let error = new Error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
      throw error
    } else {
      console.log(typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
    }
  })
  let exitCode = emitResult.emitSkipped ? 1 : 0
  if (exitCode != 0) {
    throw new Error("TypeScript compilation failed")
  }
}

// Execute tsc -noEmit
async function tscWrapper() {
  try {
    let command = "tsc -noEmit"
    let { stdout, stderr } = await exec(command)
    if (stderr) {
      throw new Error(stderr)
      return
    }
    console.log(stdout)
  } catch (e) {
    throw e
  }
}

if (require.main === module) {
  console.log("Executing tscSync in standalone mode")
  tscSync()
}

module.exports = tscSync
