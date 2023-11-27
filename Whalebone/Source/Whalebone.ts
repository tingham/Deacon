/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// import ejs for client-side rendering

// C: \Users\tingh\source\repos\Deacon\node_modules\ejs\ejs.min.js

// Mix-in the declaration for ejs so that we can use it in the browser
// @discuss This is a bit of a hack, but it works
import { Entity } from "../../Witch/ViewModelEntities/Entity"
import ejs, { IncluderCallback } from "ejs"

// Yank the entire file for ejs/ejs.min.js into this file so that it can be used in the browser


export const WHALE_ROOT = "./Data/Templates"

// Provides client-side rendering of entities without a file system
// @discuss Under no circumstances are we to allow access outside of the entity that is being rendered this nearly drove me to suicide when I was writing Envodig because you lose track of scope almost immediately
export class Whalebone {
  private static instance: Whalebone
  public static get Instance(): Whalebone {
    if (!Whalebone.instance) {
      Whalebone.instance = new Whalebone()
    }
    return Whalebone.instance
  }

  public Files: Map<string, FileEntry> = new Map<string, FileEntry>()

  public async Initialize() : Promise<void> {
    // Whalebone should only run in the browser
    const isBrowser = typeof window?.DOMParser != "undefined"
    if (!isBrowser) {
      throw new Error("Whalebone should only be instanced in the browser.")
    }

    let fileResponse
    try {
      // Pulpit will provide access to specifically named paths at their originating path without any routing required
      fileResponse = await fetch(`/jonah/${new Date().getTime()}/Templates.json`)
    } catch (error) {
      console.error(error)
    }

    if (!fileResponse) {
      throw new Error(`File response was empty`)
    }

    let fileData: any
    try {
      fileData = await fileResponse.json()
    } catch (error) {
      console.error(error)
    }

    for (const [keypath, value] of Object.entries(fileData)) {
      if (!(value as any)?.Content) {
        continue
      }
      this.Files.set(keypath, new FileEntry(keypath, (value as any)?.Content?.toString()))
    }
  }

  // Looks up the rendering template container via filepath and then
  // produces output
  public async Render(entity: Entity, toTemplate: string): Promise<string | undefined> {
    if (toTemplate.includes("/")) {
      const failureTest = `${WHALE_ROOT}/${toTemplate}`
      // Look through keys to find the most likely match
      const keyMatches = Array.from(this.Files.keys()).filter((key) => key.includes(toTemplate))
      let entry
      if (keyMatches.length === 1) {
        entry = this.Files.get(keyMatches[0])
      }
      if (entry == undefined) {
        throw new Error(`Could not find template at path ${toTemplate}`)
      }
      return entry.Render(entity)
    }
  }

  public async RenderDOM(entity: Entity, toTemplate: string): Promise<HTMLElement | HTMLCollection | undefined> {
    let template = document.createElement("template")
    let data = await this.Render(entity, toTemplate)
    if (data == undefined) {
      throw new Error(`Could not render ${toTemplate}`)
    }
    template.innerHTML = data.trim()
    let result = template.content.children
    if (result.length === 1) {
      return result[0] as HTMLElement
    } else {
      return result as HTMLCollection
    }
  }

  public Perform (element: HTMLElement | HTMLCollection, intoContainer: HTMLElement): EventTarget {
    // Simple event emitter subclass
    const Class = class extends EventTarget {
      public Performer = new Performer(element, intoContainer)
      public actions: Set<()=>void> = new Set<()=>void>()
      public constructor() { super() }

      // The consumer calls Whalebone.Instance.Perform(sourceElement, container).Act("append", 0.3, () => { /* do something */ }).Act("remove", 1.0, () => { /* do something */ })
      // Or 
      // ```
      //   let actor = Whalebone.Instance.Perform(sourceElement, container).Act("append", 0.3).Act("remove", 1.0)
      //   actor.addEventListener("append", () => { /* do something */ })
      //   actor.addEventListener("remove", () => { /* do something */ })
      public Act(action: string, waitTime: number, callback?: (...args: any[]) => void) {
        let weakRef = this
        let fn = () => {
          if (callback) {
            callback(weakRef.Performer)
            return
          }
          this.dispatchEvent(new CustomEvent(action, { detail: weakRef.Performer }))
        }
        (fn as any).delay = waitTime;
        (fn as any).label = action;
        this.actions.add(fn)
        return this
      }

      public async Step(): Promise<void> {
        let action = this.actions.values().next().value
        console.log(`Pending action ${action.label} (${action.delay}s)`)
        await this.Timeout(action.delay * 1000)
        await action()
        console.log(`Action ${action.label} complete!`)
        this.actions.delete(action)
      }

      public async Timeout(milliseconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

      public async Play () {
        // Copy the references to the actions so that we can iterate over them
        let frozenActions = Array.from(this.actions)
        for (const fza of frozenActions) {
          // Because we are using a frozen copy of the actions, we can safely remove them from the set
          await this.Step()
        }
      }
    }
    return new Class()
  }

  public static Includer() : IncluderCallback {
    return (originalPath: string, parsedPath: string): { template: string } => {
      if (!(Whalebone.Instance.Files).has(parsedPath)) {
        throw new Error(`Could not find template at path ${parsedPath}`)
      }
      if (!(Whalebone.Instance.Files?.get(parsedPath)?.Content)) {
        throw new Error(`Could not find template at path ${parsedPath}`)
      }
      const entry = Whalebone.Instance.Files.get(parsedPath)
      if (entry == undefined) {
        throw new Error(`Could not find template at path ${parsedPath}`)
      }
      return { template: entry.Content }
    }
  }


}

export function WhaleDirname(str: string, sep = "/") {
  return str.substring(0, str.lastIndexOf(sep));
}
export function WhaleBasename (str: string, sep = "/") {
  return str.substring(str.lastIndexOf(sep) + 1);
}

type RenderingFunction = (locals: any) => Promise<string>

class FileEntry {
  public Path: string
  public Content: string
  public Render: RenderingFunction
  constructor(path: string, content: string) {
    this.Path = path
    this.Content = content
    if (this.Content && this.Content != "") {
      this.Render = ejs.compile(this.Content, { async: true, client: true, includer: Whalebone.Includer() })
      return
    }
    throw new Error(`Could not initialize a rendering method for path ${path}`)
  }
}

class Performer {
  constructor(public Element: HTMLElement | HTMLCollection, public Container: HTMLElement) {
  }

  public Remove(): Performer {
    if (this.Element instanceof HTMLElement) {
      this.Element.remove()
      return this
    }

    if (this.Element instanceof HTMLCollection) {
      for (const e of Array.from(this.Element)) {
        (e as HTMLElement).remove()
      }
      return this
    }

    return this
  }

  public Append(): Performer {
    if (this.Element instanceof HTMLElement) {
      this.Container.appendChild(this.Element)
      return this
    }

    if (this.Element instanceof HTMLCollection) {
      for (const e of Array.from(this.Element)) {
        this.Container.appendChild(e)
      }
      return this
    }

    return this
  }

  private replaceClass(element: HTMLElement, outgoing: string, incoming: string) {
    element.classList?.remove(outgoing)
    element.classList?.add(incoming)
  }

  public ReplaceClass(mess: string): Performer
  public ReplaceClass(outgoing: string, incoming: string): Performer
  public ReplaceClass(...args: string[]) {
    let outgoing: string
    let incoming: string

    if (args.length === 1) {
      [outgoing, incoming] = args[0].split(Performer.DelimiterFromString(args[0]))
    } else if (args.length === 2) {
      [outgoing, incoming] = args
    } else {
      throw new Error(`ReplaceClass requires either a single string or two strings`)
    }
    if (this.Element instanceof HTMLElement) {
      this.replaceClass(this.Element, outgoing, incoming)
      return this
    }

    if (this.Element instanceof HTMLCollection) {
      for (const e of Array.from(this.Element)) {
        this.replaceClass(e as HTMLElement, outgoing, incoming)
      }
      return this
    }

    return this
  }

  static DelimiterFromString(incoming: string): string {
    // ABcdEF=>ABcdFF
    let regex = /.\w(?<delimiter>\W+).\w/ig
    let result = regex.exec(incoming)
    if (result?.groups?.delimiter) {
      return result.groups.delimiter
    }
    return ""
  }
}
