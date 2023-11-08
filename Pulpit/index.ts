/**
 * Pulpit
 * @class Pulpit
 * @description A collection of static methods to provide services for:
 * - Registration of routes
 * - Processing of request bodies
 * - Rendering of views
 **/

// Direct manipulation of the routing class and handlers is made possible by exposing this submodule
export * from "./Routing"
// Oversight and informing the processing of request data is exposed through this submodule
export * from "./Processing"
// Rendering of views and configuration of optional template engines is exposed through this submodule
export * from "./Rendering"

export * from "./Request"

export * from "./Response"

// The Pew class is the application class of the Pulpit library and is exposed here
export * from "./Pew"