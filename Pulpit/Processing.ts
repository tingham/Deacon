export enum PathMaskStyle {
  NONE,
  CURLY,
  COLON,
  PIPE
}

type ForEachFunctor = (item: string, index: number, container: string[]) => void

export class PathElement {
  public Key: string
  public Ordinal: number
  public Value: string | undefined

  constructor(key: string, ordinal: number, value?: string) {
    this.Key = key
    this.Ordinal = ordinal
    this.Value = value
  }
}

// MaskedPath
// Paths are generally constructed in the form of:
// /path/to/{variable}/suffix
// /path/to/:variable/suffix
// /path/to/|variable|/suffix
export class MaskedPath {
  // The original unmolested path
  public Path: string

  // The path broken into its constituent elements by standard url separator
  public Elements: string[] = []

  // The querystring of the path
  public Querystring: string = ""

  // The key-value pairs of the querystring
  public QuerystringPairs: Map<string, string> = new Map<string, string>()

  // The path mask style, which can be forced by the implementor
  public Style: PathMaskStyle

  // Elements keyed by `${name}:${absolute index}`
  public MappedElements: Map<string, PathElement> = new Map<string, PathElement>()

  constructor(path: string, style: PathMaskStyle) {
    this.Path = path
    this.Style = style
    this.Elements = this.normalizedPath().split("/")

    this.decomposeQuerystring()

    let decomposer: ForEachFunctor | undefined
    // Given the mask style, decompose the path into its constituent elements
    if (style) {
      if (this.Decomposers.has(style)) {
        decomposer = this.Decomposers.get(style)!
        if (decomposer) {
          this.Elements.forEach(decomposer, this)
        }
      }
    }
  }

  // Given a request path, determine how closely it matches the template
  public determineLikeness(requestPath: string): number {
    let template = this.normalizedPath().split("/")
    let data = requestPath.split("/")
    return determinePathLikeness(template, data)
  }

  // Given a request path, populate the MappedElements[].Value with the corresponding value from the request path
  public Match(requestPath: string): Map<string, PathElement> {
    let request = requestPath.split("/")
    // Make a copy of the mapped elements so that we don't overwrite the original
    for (let [key, value] of Array.from(this.MappedElements.entries())) {
      value.Value = request[value.Ordinal]
    }
    return this.MappedElements
  }

  public Test (requestPath: string): boolean {
    // If the path lengths are different, they can't match
    let requestComponents = requestPath.split("/")
    if (requestComponents.length !== this.Elements.length) {
      return false
    }
    // If the path lengths are the same, compare each element for either: equality, or a variable
    for (let i = 0; i < this.Elements.length; i++) {
      let templateElement = this.Elements[i]
      let requestElement = requestComponents[i]
      // If the elements are not equal
      if (templateElement !== requestElement) {
        // if the template element is not a variable and the request element is not the same as the template element
        if (!this.MappedElements.has(templateElement)) {
          return false
        }
      }
    }
    return true
  }

  decomposeQuerystring() {
    this.Querystring = this.normalizedPath().split("?")[1]
    if (this.Querystring) {
      let pairs = this.Querystring.split("&")
      for (let pair of pairs) {
        let [key, value] = pair.split("=")
        this.QuerystringPairs.set(key, value)
      }
    }
  }

  // Characters such as # at the end of a path will cause angina pain, remove them for processing
  normalizedPath(): string {
    return this.Path ? this.Path.split("#")[0] : ""
  }

  private decomposers: Map<PathMaskStyle, ForEachFunctor> = new Map<PathMaskStyle, ForEachFunctor>()

  public get Decomposers(): Map<PathMaskStyle, ForEachFunctor> {
    if (this.decomposers == null || this.decomposers.size === 0) {
      this.decomposers = MaskedPath.DefaultDecomposers
    }
    return this.decomposers
  }

  public static get DefaultDecomposers(): Map<PathMaskStyle, ForEachFunctor> {
    return new Map<PathMaskStyle, ForEachFunctor>([
      [PathMaskStyle.CURLY, decomposeCurlyTemplate],
      [PathMaskStyle.COLON, decomposeColonTemplate],
      [PathMaskStyle.PIPE, decomposePipeTemplate]
    ])
  }

}

// Iterates over each element and if it is a variable, adds it to the map with the current index
function decomposeColonTemplate(this: MaskedPath, item: string, index: number, container: string[]): void {
  if (item.startsWith(":")) {
    let cleaned = item.slice(1)
    this.Elements[index] = cleaned
    this.MappedElements.set(cleaned, new PathElement(item, index))
  }
}

function decomposePipeTemplate(this: MaskedPath, item: string, index: number, container: string[]): void {
  if (item.startsWith("|") && item.endsWith("|")) {
    let cleaned = item.slice(1, item.length - 1)
    this.Elements[index] = cleaned
    this.MappedElements.set(cleaned, new PathElement(item, index))
  }
}

function decomposeCurlyTemplate(this: MaskedPath, item: string, index: number, container: string[]): void {
  if (item.startsWith("{") && item.endsWith("}")) {
    let cleaned = item.slice(1, item.length - 1)
    this.Elements[index] = cleaned
    this.MappedElements.set(cleaned, new PathElement(item, index))
  }
}


// Produces the most likely path mask style from the template path
function determinePathMaskStyle(path: string): PathMaskStyle {
  if (path.indexOf("{") > -1) {
    return PathMaskStyle.CURLY
  } else if (path.indexOf(":") > -1) {
    return PathMaskStyle.COLON
  } else if (path.indexOf("|") > -1) {
    return PathMaskStyle.PIPE
  } else {
    return PathMaskStyle.NONE
  }
}

// Of the total number of path components, how many are identical between the template and the request?
function determinePathLikeness(template: string[], data: string[]): number {
  let longestSequence = (template.length > data.length) ? template : data
  let wholeLikeness = 0
for (let i = 0; i < longestSequence.length; i++) {
    if (template[i] === data[i]) {
      wholeLikeness++
    }
  }
  return wholeLikeness / longestSequence.length
}
