import { Scheme } from "../Model/Scheme";

// Schemer
// Automates method implementations for SchemeManager concrete classes

export function Schemer(SchemeType: new (...params: any[]) => Scheme) {
    // Return the class being modified extended by the abstract class; using an intermediate class named "SchemeManager"
    return function(target: any, _context?: ClassDecoratorContext) {
        // Static Scheme that backs the SchemeManager
        target.Scheme = SchemeType;

        // Create a new scheme instance and save it
        target.prototype.New = async function(...params: any[]) {
            let instance = new SchemeType(params);
            if (instance.Root) {
                // Serialize the instance to the database
                await this.Save(instance);
            }
            return instance;
        };

        // Save the scheme instance and its subordinate instances
        target.prototype.Save = async function(instance: Scheme | Scheme[]) {
            if (!(instance instanceof Array)) {
                instance = [instance];
            }
            for (const item of instance) {
                if (item.Root) {
                    // Serialize the instance to the database
                    await this.Save(item);
                    // Potentially serialize the subordinate instances to the database
                    // We don't have references to fields on the specific sub-class yet
                }
            }
        };
    };
}
