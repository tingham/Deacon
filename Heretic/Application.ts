import { Request, Response, Route, RouteMethod, PathMaskStyle, Pew, Turnstyle} from '../Pulpit/index';
import { VTCH, DetailModel, IndexDetailModel, Action, Element, IndexDetailFlag } from '../Witch/index';
import {Log} from "../Sword/Log"
import { VTCHNode } from '../Witch/Stock';
import { GenerateRandomInstance } from '../Sword/Generator';

export class Application  extends Pew {
    constructor() {
        super(PathMaskStyle.COLON, 8080, 8081)
    }
}

const appInstance = new Application()

// What do we need to make view output?

// 1. We need an imprint (a concrete viewmodel) class to display a list of shit and a detail of a selection
// 2. We need a collection of instances to render
// 3. We need a helper

class DetailImprint extends DetailModel<VTCHNode> {
    public get Fields(): Element[] | undefined {
      return [
        Element.Factory("Name", null),
        Element.Factory("Description", null)
      ]
    }
    public get Title(): string | undefined {
      if (this?.Instance?.Name) {
        return this.Instance.Name
      }
      return "A Node"
    }
    public get Description(): string | undefined {
      return "Nodes are just.. nodes"
    }
    public get PluralName(): string | undefined {
      return "Nodes"
    }
    public get SingularName(): string | undefined {
      return "Node"
    }
    public get AddAction(): Action | undefined {
      return
    }
}

class IndexDetailImprint extends IndexDetailModel<VTCHNode, DetailImprint> {
    public get Title(): string | undefined {
      return this.PluralName
    }
    public get Description(): string | undefined {
      return "Nodes List"
    }
    public get PluralName(): string | undefined {
      return "Nodes"
    }
    public get SingularName(): string | undefined {
      return "Node"
    }
    public get AddAction(): Action | undefined {
      return
    }

    constructor() {
      super()
      this.Helpers.push("ForEachHelper")
    }
}

let index = appInstance.AddRoute("/")

index.Attach(RouteMethod.GET, async (request: Request, response: Response, context: Route): Promise<Turnstyle> => {
  let result = ""

  const style = `<style>
  body {
    font-family: "Source Sans Pro3", sans-serif;
  }
  vtch-index {
  }
  vtch-index-item {
    display: block;
    padding: 1rem;
    margin: 1rem;
  }
  </style>`
  const template = `<!DOCTYPE html><head><%= Title %>
  ${style}
  </head>
  <body>
    <vtch-index-detail>
    <vtch-header><%= Title %></vtch-header>
    <vtch-index><%- await ForEachHelper(Items) %></vtch-index>
    <% if (Selection.length > 0) { %>
      <vtch-detail>
        <% for (const field of Fields) { %>
          <vtch-field>
            <label for="<%= field.KeyPath %>"><%= field.Label %></label>
            <input type="text" id="<%= field.KeyPath %>" name="<%= field.KeyPath %>" value="<%= Selection[0][field.KeyPath] %>">
          </vtch-field>
        <% } %>
      </vtch-detail>
    <% } %>
  </body>
</html>`

  // Register the index detail imprint with a template
  const View = VTCH.Factory(IndexDetailImprint, template)
  // This view already has the ForEachHelper registered, but we can add more helpers
  // view.AddHelper("ForEachHelper", Helpers.Instance.ForEachHelper)
  // view.AddHelper("MarkdownHelper", Helpers.Instance.MarkdownHelper)
  // etc.

  // Now we need to create a collection of instances to render
  const nodes = new Array<VTCHNode>()
  for (let i = 0; i < 10; i++) {
    let someNode = GenerateRandomInstance(VTCHNode)
    nodes.push(someNode)
  }

  // Now we need to create an instance of the imprint and set the collection
  const imprint = new IndexDetailImprint()
  imprint.Items = nodes
  imprint.Flags = IndexDetailFlag.SingleSelect

  let view = new View()
  result = await view.Render(imprint)

  response.Write(result)

  return Turnstyle.Stop

})

let artifact = appInstance.AddRoute("/artifact/:artifactId")

artifact.Attach(RouteMethod.GET, async (request: Request, response: Response, context: Route):  Promise<Turnstyle> => {
    response.Write(`The message is ${artifact.MaskedPathInstance.MappedElements.get("artifactId")?.Value}`)
    response.Write(`The fancy utility method used to get the message produced ${artifact.Mask("artifactId")}`)
    return Turnstyle.Stop
})

artifact.Attach(RouteMethod.POST, async (request: Request, response: Response, context: Route):  Promise<Turnstyle> => {
    response.Write(`The message is ${artifact.MaskedPathInstance.MappedElements.get("artifactId")?.Value}`)

    let body = await request.Read()
    Log.info("Application", {body})
    response.Write(body? JSON.stringify(body, null, 2) : `Empty Body`)
    return Turnstyle.Stop
})

appInstance.Start()