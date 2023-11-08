// Template
// The data-less skeleton upon which a view or layout can be rendered
export class Template extends String {
}

// RenderingEngine
// A class adapted to normalize rendering functions provided by the various template engines
export class RenderingEngine {
}

export abstract class AbstractView {
}

// Part
// A fragment of a view that can be rendered within any View or Part, optionally made available to the browser
export class Part extends AbstractView {
}

// View
// A view is a template that can be rendered within a layout
export class View extends AbstractView {
}

export abstract class AbstractLayout {
}

// Layout
// A layout constitutes a top-level container for views
export class Layout extends AbstractLayout {
}