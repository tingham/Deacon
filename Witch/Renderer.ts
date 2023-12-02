import ejs from "ejs"
import { Entity } from "./ViewModelEntities/Entity"
import path, { basename } from "path"
import { Field } from "./ViewModelEntities/Field"
import { existsSync, readFileSync } from "fs"
import { ViewRenderError } from "../Sword/Error/Exception"

const TEMPLATES_DIRECTORY_ROOT = path.join(process.cwd(), `Data/Templates/`)

export class Renderer {
  // Can be overridden to change the root directory for templates
  public static TemplatesRoot: string = TEMPLATES_DIRECTORY_ROOT

  // Utility for rendering a single field and returning the HTML (string)
  public static async Render(entity: Entity, toTemplate: string): Promise<string> {
    // toTemplate may be either a path to a template file, or a string containing the template itself

    if (toTemplate.includes("/") || toTemplate.includes(".ejs")) {
      // The templates path will generally look like this: Data/Templates/Fields/HTMLComponent/<template>.ejs
      // We need to overlay our known structure on top of the given path to get the full path to the template
      // e.g. The consumer provides "Select.ejs" or "HTMLComponent/Select.ejs" and we need to get "Data/Templates/Fields/HTMLComponent/Select.ejs"
      const pathFailureTest = path.join(Renderer.TemplatesRoot, basename(toTemplate))
      let pathPrototype = path.join(Renderer.TemplatesRoot, `Fields`, `HTMLComponent`, toTemplate)

      // Remove path components from the right, before the basename, until we get a valid path or are left with only `${TemplatesRoot}/${basename}`
      while (!existsSync(pathPrototype) && pathPrototype !== pathFailureTest) {
        pathPrototype = path.join(path.dirname(pathPrototype), basename(pathPrototype))
      }

      if (pathPrototype === pathFailureTest) {
        throw new Error(`Could not find template at path ${pathPrototype}`)
      }

      let result
      try {
        result = await ejs.renderFile(pathPrototype, entity, { async: true })
      } catch (error) {
        throw ViewRenderError.FromError(pathPrototype, error as Error)
      }
      return result
    }

    return ""
  }
}