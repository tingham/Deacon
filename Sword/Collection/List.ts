import { kill } from "process";

// A utility class for managing collections of anything
// Iterable to be implemented when we move to ES6
export abstract class AbstractList<T> {
  private collection: Array<ValueItem<T>> = new Array<ValueItem<T>>()

  public get Collection(): Array<ValueItem<T>> {
    return this.collection;
  }

  public set Collection(value: Array<ValueItem<T>>) {
    this.collection = value;
  }
  constructor(items?: Array<T>)
  constructor(items?: Array<ValueItem<T>>)
  constructor(items?: unknown) {
    if (items instanceof Array && items.length > 0 && items[0] instanceof ValueItem) {
      this.collection = items
    } else if (items instanceof Array) {
      for (const item of items) {
        this.collection.push(new ValueItem(item))
      }
    }
  }
}

export class ValueItem<T> {
  public Value?: T
  public Next?: ValueItem<T>
  public Previous?: ValueItem<T>

  // Is there a way to assert that this is the definitive guard for the value being set?
  public IsValid(): boolean {
    return this.Value != undefined
  }

  constructor(value?: T) {
    if (value) {
      this.Value = value
    }
  }
}

export interface IList<T> {
  AddRange(some: T): void
  AddRange(some: Array<T>): void
  AddRange(some: IList<T>): void

  Add(an: T): void
  AddAt(index: number, an: T): void

  RemoveRange(some: T): void
  RemoveRange(some: Array<T>): void
  RemoveRange(some: IList<T>): void

  Remove(an: T): void
  RemoveAt(index: number): void

  Clear(): void
  Contains(some: T): boolean
  Sum(Keypath: string): number
  Average(Keypath: string): number
  Min(Keypath: string): number
  Max(Keypath: string): number
  StandardDeviation(Keypath: string): number
  Median(Keypath: string): number
  Mean(Keypath: string): number

  Organize(): void
}

export interface IObservableList<T> extends IList<T> {
  Add(an: T): void
  Remove(an: T): void
  RemoveAt(index: number): void
  Clear(): void
}

export interface IListObserver<T> {
  OnAdd(e: ObservableEvent<T>): void
  OnRemove(e: ObservableEvent<T>): void
  OnClear(e: ObservableEvent<T>): void
}

export class ObservableEvent<T> extends CustomEvent<T> {
  constructor(description: string, detail: T) {
    super(description, detail as any)
  }
}

export class List<T> extends AbstractList<T> implements IList<T> {
  AddRange(some: T): void;
  AddRange(some: T[]): void;
  AddRange(some: IList<T>): void;
  AddRange(some: unknown): void {
    if (some instanceof Array) {
      for (const item of some) {
        this.Add(item)
      }
    }
    if (some instanceof List) {
      for (const item of some.Collection) {
        this.Add(item.Value)
      }
    }
    // If a single item is passed, add it
    if (some instanceof ValueItem && some.Value) {
      this.Add(some.Value)
    }
  }
  Add(an: T): void {
    if (an instanceof ValueItem) {
      this.Collection.push(an)
    } else {
      this.Collection.push(new ValueItem(an))
    }
  }
  AddAt(index: number, an: T): void {
    if (an instanceof ValueItem) {
      this.Collection.splice(index, 0, an)
    } else {
      this.Collection.splice(index, 0, new ValueItem(an))
    }
  }

  RemoveRange(some: T): void;
  RemoveRange(some: T[]): void;
  RemoveRange(some: IList<T>): void;
  RemoveRange(some: unknown): void {
    if (some instanceof Array) {
      for (const item of some) {
        this.Remove(item)
      }
    }
    if (some instanceof List) {
      for (const item of some.Collection) {
        this.Remove(item.Value)
      }
    }
    if (some instanceof ValueItem && some.Value) {
      this.Remove(some.Value)
    }
  }
  Remove(an: T): void {
    this.Collection = this.Collection.filter((item) => item.Value != an)
  }
  RemoveAt(index: number): void {
    this.Collection = this.Collection.filter((item, i) => i != index)
  }

  Clear(): void {
    this.Collection = new Array<ValueItem<T>>()
  }
  Contains(some: T): boolean {
    return this.Collection.map(item => item.Value).includes(some)
  }
  Sum(Keypath: string): number {
    let result = 0
    for (const item of this.Collection) {
      result += item?.Value?.hasOwnProperty(Keypath) && (item.Value as any)[Keypath] instanceof Number ? (item.Value as any)[Keypath] : 0
    }
    return result
  }

  Average(Keypath: string): number {
    return this.Sum(Keypath) / this.Collection.length
  }

  Min(Keypath: string): number {
    let result = Number.MAX_VALUE
    for (const item of this.Collection) {
      result = Math.min(result, item?.Value?.hasOwnProperty(Keypath) && (item.Value as any)[Keypath] instanceof Number ? (item.Value as any)[Keypath] : Number.MAX_VALUE)
    }
    return result
  }

  Max(Keypath: string): number {
    let result = Number.MIN_VALUE
    for (const item of this.Collection) {
      result = Math.max(result, item?.Value?.hasOwnProperty(Keypath) && (item.Value as any)[Keypath] instanceof Number ? (item.Value as any)[Keypath] : Number.MIN_VALUE)
    }
    return result
  }

  StandardDeviation(Keypath: string): number {
    let result = 0
    const mean = this.Mean(Keypath)
    for (const item of this.Collection) {
      result += Math.pow(item?.Value?.hasOwnProperty(Keypath) && (item.Value as any)[Keypath] instanceof Number ? (item.Value as any)[Keypath] : 0 - mean, 2)
    }
    return Math.sqrt(result / this.Collection.length)
  }

  Median(Keypath: string): number {
    let result = 0
    const values = this.Collection.map(item => item?.Value?.hasOwnProperty(Keypath) && (item.Value as any)[Keypath] instanceof Number ? (item.Value as any)[Keypath] : 0)
    values.sort()
    if (values.length % 2 == 0) {
      result = (values[values.length / 2] + values[values.length / 2 + 1]) / 2
    } else {
      result = values[Math.floor(values.length / 2)]
    }
    return result
  }

  Mean(Keypath: string): number {
    let result = 0
    let uniqueValues = Array.from(new Set<number>(...(this.Collection.map(item => item?.Value?.hasOwnProperty(Keypath) && (item.Value as any)[Keypath] instanceof Number ? (item.Value as any)[Keypath] : 0))));
    for (const item of uniqueValues) {
      result += item
    }
    return result / this.Collection.length
  }

  Organize(): void {
    for (const item of this.Collection) {
      if (item.Previous) {
        item.Previous.Next = item
      }
      if (item.Next) {
        item.Next.Previous = item
      }
    }
  }
}

export class ObservableList<T> extends List<T> implements IObservableList<T> {
  private Observers: Array<IListObserver<T>> = new Array<IListObserver<T>>()

  public AddObserver(observer: IListObserver<T>): void {
    this.Observers.push(observer)
  }

  public RemoveObserver(observer: IListObserver<T>): void {
    this.Observers = this.Observers.filter(o => o !== observer)
  }

  Add(an: T): void {
    if (an instanceof ValueItem) {
      this.Collection.push(an)
    } else {
      this.Collection.push(new ValueItem(an))
    }
    if (this.Observers.length > 0) {
      for (const observer of this.Observers) {
        observer.OnAdd(new ObservableEvent<T>("Add", an))
      }
    }
  }
  AddAt(index: number, an: T): void {
    if (an instanceof ValueItem) {
      this.Collection.splice(index, 0, an)
    } else {
      this.Collection.splice(index, 0, new ValueItem(an))
    }
    if (this.Observers.length > 0) {
      for (const observer of this.Observers) {
        observer.OnAdd(new ObservableEvent<T>("Add", an))
      }
    }
  }
  Remove(an: T): void {
    this.Collection = this.Collection.filter((item) => item.Value != an)
    if (this.Observers.length > 0) {
      for (const observer of this.Observers) {
        observer.OnAdd(new ObservableEvent<T>("Remove", an))
      }
    }
  }
  RemoveAt(index: number): void {
    let an = this.Collection[index] as T
    this.Collection = this.Collection.filter((item, i) => i != index)
    if (this.Observers.length > 0) {
      for (const observer of this.Observers) {
        observer.OnAdd(new ObservableEvent<T>("Remove", an))
      }
    }
  }
  Clear(): void {
    if (this.Observers.length > 0) {
      for (const observer of this.Observers) {
        observer.OnAdd(new ObservableEvent<T>("Clear", this as any))
      }
    }
  }
}