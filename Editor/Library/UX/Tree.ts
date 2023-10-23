import { Panel } from "./Panel.js"
import { View } from "./View.js"

// A panel that contains a sequence of records, presumably with children, and an item view for each record type: Container and Item
export class Tree extends Panel {
  public static TAG = "deacon-tree"
  public items?: Array<any>
  public ChildAccessor?: string

  public ItemView?: View
  public ContainerView?: View

  private openItems: Set<any> = new Set<any>()
  private containerItems: Set<any> = new Set<any>()

  public connectedCallback() {
  }

  public set Items(value: any) {
    this.items = value
    this.UpdateLayout()
  }

  public UpdateLayout() {
    let renderedItems = new Array<View>()
    // Iterate through the items and create a view for each based on the type
    if (this.items) {
      for (const item of this.items) {
        if (item.Schema.Fields.has(this.ChildAccessor)) {
          let childValues = item.Values.get(this.ChildAccessor)
          if (childValues instanceof Array) {
            // This is a container
            this.containerItems.add(item)
          }
        }
        this.renderItem(item, renderedItems)
      }

      for (const renderedItem of renderedItems) {
        this.appendChild(renderedItem)
      }
    }
  }

  private renderItem(item: any, renderedItems: View[]) {
    let view = this.ViewForRow(item)
    let weakReference = this
    view.addEventListener("mouseup", (event: Event) => {
      weakReference.ItemSelected(item)
    })
    if (weakReference.openItems.has(item)) {
      for (const childItem of item.Values.get(weakReference.ChildAccessor)) {
        weakReference.renderItem(childItem, renderedItems)
      }
    }
    renderedItems.push(view)
  }

  private ViewForRow(row: any): View {
    let view = null
    if (this.containerItems.has(row)) {
      if (!this.ContainerView) {
        throw new Error("ContainerView not set")
      }
      view = document.createElement(this.ContainerView.tagName) as View
    } else {
      if (!this.ItemView) {
        throw new Error("ItemView not set")
      }
      view = document.createElement(this.ItemView.tagName) as View
    }
    return view
  }

  public ItemSelected(item: any) {
    let event = new CustomEvent("itemselected", { detail: item })
    if (this.containerItems.has(item)) {
      this.openItems.add(item)
    } else {
      this.openItems.delete(item)
    }
    this.dispatchEvent(event)
  }
}

// customElements.define(Tree.TAG, Tree)

export interface ITreeItem {
  Data: any
  Children: ITreeItem[]
}