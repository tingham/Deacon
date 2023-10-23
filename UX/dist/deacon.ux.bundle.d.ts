declare module "Component/Buffer" {
    export class Buffer extends HTMLElement {
    }
}
declare module "Component/View" {
    export class View extends HTMLElement {
        RegisteredEvents: Map<string, EventListener>;
        unregisterEvents(): void;
        register(name: string, callback: EventListener): void;
        unregister(name: string): void;
    }
}
declare module "Component/SplitView" {
    export class SplitView extends HTMLElement {
        orientation: string;
        resizeable: boolean;
        private resizeHandle?;
        static get observedAttributes(): string[];
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        onConnectedCallback(): void;
        private updateResizeHandle;
        private showResizeHandle;
        private hideResizeHandle;
    }
}
