export function IsConcreteViewModel(viewModelInstance, BASECLASS) {
    if (Object.getPrototypeOf(viewModelInstance) === BASECLASS) {
        return true;
    }
    var prototypeChain = new Array();
    var currentPrototype = viewModelInstance.constructor;
    while (currentPrototype) {
        prototypeChain.push(currentPrototype);
        currentPrototype = currentPrototype.prototype;
    }
    if (prototypeChain.includes(BASECLASS)) {
        return true;
    }
    return false;
}
//# sourceMappingURL=Imprint.js.map