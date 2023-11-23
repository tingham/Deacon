import { readFileSync } from "fs"

export class DataLoader {
  public static LoadHTML(filepath: string) {
    let finalPath = `Data/HTML/${filepath}`
    let data = readFileSync(finalPath, 'utf8')
    return data
  }

  // File paths are relative to the "../Data/Templates" directory
  public static LoadTemplate(filepath: string) {
    let finalPath = `Data/Templates/${filepath}`
    let data = readFileSync(finalPath, 'utf8')
    return data
  }

  public static LoadCSS(filepath: string) {
    let finalPath = `Data/CSS/${filepath}`
    // TODO: If the file is .scss, we need to compile it
    // TODO: If the file is .less, we need to compile it
    // If the file is .css, we can just return it
    let data = readFileSync(finalPath, 'utf8')
    return data
  }
}