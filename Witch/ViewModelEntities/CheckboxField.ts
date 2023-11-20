import { CollectionField } from "./CollectionField"

const outerTemplate = `<vtch-field><%- fieldBody %></vtch-field>`
const bodyTemplate = `<vtch-checkbox-field><%- fieldBody %></vtch-checkbox-field>`
const controlTemplate = `<% for (const child of Collection) { %><input name="<%- child.Keypath %>" id="<%- child.Keypath %>" value="<%- child.Value %>" type="checkbox" /><label for="<%- child.Keypath %>"><%- child.Label %></label><% } %>`

// A group of checkboxes to be rendered in a form or as part of a header component, or inline on a table (list)
export class CheckboxField extends CollectionField {
}

// A single checkbox collection 
export class ConfirmField extends CheckboxField {
}

export class YesNoField extends CheckboxField {
}
