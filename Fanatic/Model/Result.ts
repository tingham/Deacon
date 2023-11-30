
// A class that wraps scheme instances in a list

import { BeginResultException, EndResultException } from "../../Sword/Errors/Exception"
export class Result<T> extends Array {
  public FirstOrDefault(): T | null {
    if (this[0]) {
      return this[0]
    }
    return {} as T
  }
  public LastOrDefault(): T | null {
    if (this[this.length - 1]) {
      return this[this.length - 1]
    }
    return {} as T
  }
  public First(): T {
    if (this[0]) {
      return this[0]
    }
    throw new BeginResultException("No results found")
  }
  public Last(): T {
    if (this[this.length - 1]) {
      return this[this.length - 1]
    }
    throw new EndResultException()
  }
  static override from<T>(items: T[]): Result<T> {
    return super.from(items) as Result<T>
  }
}
