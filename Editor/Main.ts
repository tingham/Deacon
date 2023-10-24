import { Tree } from "./Library/UX/Tree.js"
import { Panel } from "./Library/UX/Panel.js"
import { SplitView } from "./Library/UX/SplitView.js"
import { View } from "./Library/UX/View.js"
import * as Deacon from "./Api/index.js"

export class Main extends View {

  public connectedCallback () {

    let deacon = new Deacon.DefaultApi()
    console.log(deacon)
    
    let rootSplitView = new SplitView()

    let leftPanel = document.createElement("deacon-panel") as Panel
    let tree = document.createElement("deacon-tree") as Tree

    leftPanel.style.backgroundColor = "pink"
    leftPanel.appendChild(tree)

    console.log(tree)

    rootSplitView.appendChild(leftPanel)

    let rightPanel = document.createElement("deacon-panel") as Panel
    rightPanel.style.backgroundColor = "blue"
    let rightLabel = document.createElement("h1")
    rightLabel.innerText = "Right"
    rightPanel.appendChild(rightLabel)
    rootSplitView.appendChild(rightPanel)

    rootSplitView.orientation = "horizontal"
    rootSplitView.resizeable = true

    rootSplitView.sizes = this.getStoredValue("sizes", [0.5, 0.5])

    let weakReference = this
    rootSplitView.RegisterEventListener("splitresize", (event: Event) => {
      weakReference.setStoredValue("sizes", rootSplitView.sizes)
    })

    window.addEventListener("resize", (event: Event) => {
      View.Layout()
    })

    this.appendChild(rootSplitView)

  }

  public getStoredValue(key: string, defaultValue: any) {
    // Retrieve the stored value from localStorage
    let storedValue = localStorage.getItem(key)
    if (storedValue == null) {
      return defaultValue
    }
    return JSON.parse(storedValue)
  }

  public setStoredValue(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

customElements.define("deacon-main", Main)
customElements.define("deacon-tree", Tree)

let main = document.querySelector("deacon-main")
if (!main) {
  main = document.createElement("deacon-main") as Main
  document.body.appendChild(main)
}