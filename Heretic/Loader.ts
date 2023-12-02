import { CSSError } from "../Sword/Error/Exception"
import Less from "less"
import { existsSync, readFile, readFileSync } from "fs"

import { Log } from "../Sword/Inspect/Log"

export class DataLoader {
  private static LoadFile(filepath: string) {
    let finalPath = this.ResolvePath(filepath)
    return readFileSync(finalPath, 'utf8')
  }

  private static ResolvePath(filepath: string) {
    let index = 0
    while (!existsSync(filepath) && index < 3) {
      filepath = `../${filepath}`
      index++
    }
    return filepath
  }

  public static async LoadHTML(filepath: string) {
    let finalPath = `Data/HTML/${filepath}`
    let data = this.LoadFile(finalPath)
    return data
  }

  // File paths are relative to the "../Data/Templates" directory
  public static async LoadTemplate(filepath: string) {
    let finalPath = `Data/Templates/${filepath}`
    let data = this.LoadFile(finalPath)
    return data
  }

  public static async LoadCSS(filepath: string) {
    let finalPath = this.ResolvePath(`Data/CSS/${filepath}`)
    let data = this.LoadFile(finalPath)
    // TODO: If the file is .scss, we need to compile it
    // TODO: If the file is .less, we need to compile it
    if (filepath.endsWith(".less")) {
      data = await ProduceLessOutput(data, finalPath)
    }

    // If the file is .css, we can just return it
    return data
  }
}

async function ProduceLessOutput(input: string, filename: string) {
  try {
    const lessRender = Less.render
    let output = await lessRender(input, { filename, math: "strict", sourceMap: { sourceMapFileInline: true, outputSourceFiles: true } as Less.SourceMapOption } as Less.Options)

    return (output as any).css
  } catch (error: any) {
    Log.error(CSSError.FromError("less", error))

    return ""
  }
}