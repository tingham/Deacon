import { View } from "./View.js"

export class Panel extends View {
  public static TAG = "deacon-panel"

  public Content?: HTMLElement | null = null

  public connectedCallback() {
    super.baseConnectedCallback()
  }

}

customElements.define(Panel.TAG, Panel)
