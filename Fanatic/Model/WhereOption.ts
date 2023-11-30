import { Operator, CompoundOperator } from "../Enumerations"
import { InvalidLikeValueException } from "../../Sword/Errors/Exception";

// The template parameter T is the type of the scheme and available so that implementing classes can validate the fields of the scheme
export class WhereOption<T> {
  private components: { field: keyof T, value: any, operator: Operator }[] = []
  private compoundOperator: CompoundOperator | undefined

  // Adds a new `Field` = 'Value' pair to the option
  public Add(field: keyof T, value: any, operator?: Operator): void {
    if (operator === undefined) {
      operator = Operator.Equals
    }
    this.components.push({ field, value, operator })
  }
  // Removes all instances of `Field` from the option
  public Remove(field: keyof T): void {
    this.components = this.components.filter((component) => component.field !== field)
  }
  // A collection of `Field` = 'Value' | `Field` like '%Value%' | `Field` in ('Value1', 'Value2', 'Value3') | `Field` between 'Value1' and 'Value2' pairs
  public get Parts(): string[] {
    let result: string[] = []
    for (const component of this.components) {
      let part = `${String(component.field)} ${component.operator} ${component.value}`
      if (component.operator === Operator.Like) {
        if (typeof component.value === "string" && !component.value.toString().includes("%")) {
          throw new InvalidLikeValueException()
        }
      }
      result.push(part)
    }
    return result
  }
  // How to join the parts in this option
  public get CompoundOperator(): CompoundOperator | undefined {
    return this.compoundOperator
  }
  // The SQL joined by the operator (if any, and wrapped in parens) wrapped in parens
  public toString(): string {
    return `(${this.Parts.join(` ${this.CompoundOperator} `)})`
  }
}