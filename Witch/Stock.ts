// A "struct" of standard template components as raw html formatted in ejs syntax

import { Action } from "./Action"
import { IndexDetailModel } from "./IndexDetailModel"
import { DetailModel } from "./DetailModel"
import { IModelInstanceObserver } from "./ModelInstanceObserver"
import { TreeModel } from "./TreeModel"
import { IndexModel } from "./IndexModel"
import { InvalidInstance } from "../Sword/Errors/Exception"
import { Entity } from "./ViewModelEntities/Entity"
import { VTCH } from "./VTCH"

// Enforce type safety for a view, such that it must be given an object of a known type, to render
// Sample Data Models
// @internal
export class VTCHNode {
  public Name: string = ""
  public Description: string = ""
  public Children: Array<VTCHNode> = new Array<VTCHNode>()
}

// A detail imprint that understands how to render a VTCHNode instance
export class DetailImprint extends DetailModel<VTCHNode> {
  public get Fields(): Entity[] | undefined {
    return [
      Entity.Factory("Name", this.Instance),
      Entity.Factory("Description", this.Instance)
    ]
  }
  public get Title(): string | undefined {
    return this.Instance ? this.Instance.Name : "Some Node"
  }

  public set Title(value: string | undefined) {
    this.title = value
  }

  public get Description(): string | undefined {
    return "This is a default detail imprint, you probably don't want to use it"
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

export class DefaultImprint extends DetailModel<VTCHNode> {

  // The default imprint is hard-coded to support only model instances that have a "body" property, this must be enforced by overriding the Instance property setter method. It is important, however, that we maintain the default functionality provided by the base class.
  public set Instance(value: any) {
    if (this.instance != value) {
      if (value?.body) {
        this.instance = value
        this.InstanceObservers.forEach((observer: IModelInstanceObserver) => {
          observer.InstanceModified(this)
        })
      } else {
        throw new InvalidInstance(`The default imprint requires a model instance with a "body" property.`)
      }
    }
  }
  public get Fields(): Entity[] | undefined {
    return [
      Entity.Factory("body", this.Instance)
    ]
  }
  public get Title(): string | undefined {
    return this.title
  }

  public set Title(value: string | undefined) {
    this.title = value
  }

  public get Description(): string | undefined {
    return "This is a default imprint, you probably want to subclass it"
  }
  public get PluralName(): string | undefined {
    return "Defaults"
  }
  public get SingularName(): string | undefined {
    return "Default"
  }
  public get AddAction(): Action | undefined {
    return
  }
}

/**
 * @class DefaultIndexDetailImprint
 * @extends IndexDetailModel<VTCHNode>
 * A single "page" of content that is rendered using a view model instance.
 **/
export class DefaultIndexDetailImprint extends IndexDetailModel<VTCHNode, DefaultImprint> {
  public get Fields(): Entity[] | undefined {
    return [
      { Label: "Name", KeyPath: "Name" } as Entity,
      { Label: "Description", KeyPath: "Description" } as Entity
    ]
  }
  public get Title(): string | undefined {
    return "The Index / Detail"
  }
  public get Description(): string | undefined {
    return "An example of an index-detail view"
  }
  public get PluralName(): string | undefined {
    return "Stuff"
  }
  public get SingularName(): string | undefined {
    return "Thing"
  }
  public get AddAction(): Action | undefined {
    let action = new Action()
    action.ControllerPath = "stuff"
    action.MethodPath = "add"
    return action
  }

  constructor() {
    super()
    this.Helpers.push("ForEachHelper")
  }
}

/**
 * @class DefaultIndexImprint
 * @extends IndexModel<VTCHNode>
 * An example of a view model that contains a list of Node model instances.
 **/
export class DefaultIndexImprint extends IndexModel<VTCHNode> {

  constructor() {
    super()
  }
  public override get Items(): Array<any> {
    return [
    ]
  }

  public get Title(): string | undefined {
    return "The List"
  }
  public get Description(): string | undefined {
    return "A List of Stuff"
  }
  public get PluralName(): string | undefined {
    return "Stuff"
  }
  public get SingularName(): string | undefined {
    return "Thing"
  }
  public get AddAction(): Action | undefined {
    let action = new Action()
    action.ControllerPath = "stuff"
    action.MethodPath = "add"
    return action
  }
}

/**
 * @class DefaultTreeImprint
 * @extends TreeModel<VTCHNode>
 * An example of a view model that contains a tree of Node model instances.
 **/
export class DefaultTreeImprint extends TreeModel<VTCHNode> {
  public get Title(): string | undefined {
    return "The Tree"
  }
  public get Description(): string | undefined {
    return "A Tree of Stuff"
  }
  public get PluralName(): string | undefined {
    return "Stuff"
  }
  public get SingularName(): string | undefined {
    return "Thing"
  }
  public get ChildIdentifier(): string | undefined {
    return "Children"
  }
  public get MaxDepth(): number | undefined {
    return 3
  }
  public get AddAction(): Action | undefined {
    return
  }
}


//export class Stock {
//  public static Layout = {
//    // A simple layout that renders the title and body of a model instance
//    // Layout
//    Homepage: VTCH.Factory(DefaultImprint, `<html><head><title><%= Instance.Name %></title></head><body><%= Instance.Description %></body></html>`),
//    // A master-detail view that should be rendered within a layout
//    // View
//    IndexDetail: VTCH.Factory(DefaultIndexDetailImprint, `<vtch-index-detail><vtch-index><%- index %></vtch-index><vtch-detail><%- detail %></vtch-detail></vtch-index-detail>`),
//    // A table/list of items that should be rendered within a layout or in another view (perhaps)
//    // View
//    NodeList: VTCH.Factory(DefaultIndexImprint, `<vtch-node-list><ul><% for(let i = 0; i < nodes.length; i++) { %><li><%= nodes[i] %></li><% } %></ul></vtch-node-list>`),
//    // A tree of items that should be rendered within a layout or in another view (perhaps)
//    Tree: VTCH.Factory(DefaultTreeImprint, `<vtch-tree><ul><% for(let i = 0; i < nodes.length; i++) { %><li><%= nodes[i] %></li><% } %></ul></vtch-tree>`)
//  } as const
//}
