import { readFileSync } from "fs";
// A hyper-generalized constructor for reuse in generator functions
export function Construct(Type) {
    return new Type();
}
var WordDictionary = readFileSync("./Data/Words.txt", "utf8").split("\n");
export function GenerateRandomWords(count) {
    var result = [];
    for (var i = 0; i < count; i++) {
        var index = Math.floor(Math.random() * WordDictionary.length);
        result.push(WordDictionary[index]);
    }
    return result.join(" ");
}
/**
 * @function GenerateRandomInstance
 * A generic function that, given a Class, attempts to return an instance of that class where writeable properties are given a random value appropriate for their integral type
 **/
export function GenerateRandomInstance(Type) {
    var instance = new Type();
    var descriptors = Object.getOwnPropertyDescriptors(instance);
    for (var _i = 0, _a = Object.entries(descriptors); _i < _a.length; _i++) {
        var _b = _a[_i], propertyName = _b[0], descriptor = _b[1];
        if (descriptor.writable) {
            if (typeof descriptor.value === typeof "") {
                descriptor.value = GenerateRandomWords(Math.floor(Math.random() * 10));
            }
            if (descriptor.value instanceof Number) {
                descriptor.value = Math.random();
            }
            if (descriptor.value instanceof Boolean) {
                descriptor.value = Math.random() > 0.5;
            }
            if (descriptor.value instanceof Date) {
                descriptor.value = new Date(Math.random() * Date.now());
            }
            Object.defineProperty(instance, propertyName, descriptor);
        }
    }
    return instance;
}
/**
 * @function GenerateRandomInstances
 * A generic function that, given a Class and a count, attempts to return an array of instances of that class where writeable properties are given a random value appropriate for their integral type
 **/
export function GenerateRandomInstances(Type, count) {
    var instances = new Array();
    for (var i = 0; i < count; i++) {
        instances.push(GenerateRandomInstance(Type));
    }
    return instances;
}
/**
 * @function GenerateRandomTreeInstance
 * A generic function that, given a Class, attempts to return an instance of that class where writeable properties are given a random value appropriate for their integral type and where the instance is a tree structure
 * @param Type The class to instantiate
 * @param ChildIdentifier The name of the property that contains the child nodes
 * @param Offspringer A function that determines how many children to generate for a given node
 * @param MaxItems The maximum number of items to generate (including any nested children)
 **/
export function GenerateRandomTreeInstance(Type, ChildIdentifier, Offspringer, MaxItems) {
    var instance = new Type();
    var descriptors = Object.getOwnPropertyDescriptors(instance);
    var totalItems = 0;
    for (var _i = 0, _a = Object.entries(descriptors); _i < _a.length; _i++) {
        var _b = _a[_i], propertyKey = _b[0], descriptor = _b[1];
        if (descriptor.writable) {
            if (descriptor.value instanceof String) {
                descriptor.value = "string";
            }
            if (descriptor.value instanceof Number) {
                descriptor.value = Math.random();
            }
            if (descriptor.value instanceof Boolean) {
                descriptor.value = Math.random() > 0.5;
            }
            if (descriptor.value instanceof Date) {
                descriptor.value = new Date();
            }
            if (propertyKey == ChildIdentifier) {
                var children = (descriptor.value && descriptor.value instanceof Array) ? descriptor.value : new Array();
                var childCount = Offspringer(instance);
                for (var i = 0; i < childCount; i++) {
                    children.push(GenerateRandomTreeInstance(Type, ChildIdentifier, Offspringer, MaxItems - (totalItems + 1)));
                }
                totalItems += children.length;
                descriptor.value = children;
            }
        }
        totalItems++;
    }
    return instance;
}
//# sourceMappingURL=Generator.js.map