export enum Operator {
  Equals = "=",
  Not = "not",
  Like = "like",
  In = "in",
  NotIn = "not in",
  Between = "between"
}

export enum CompoundOperator {
  And = "and",
  Or = "or",
  Nil = ""
}

export enum LogLevel {
  Info = 0,
  Debug = 1,
  Warn = 2,
  Error = 3
}
export enum HydrationRule {
  // Fuck-nothing
  Lazy,
  // Some-shit
  Eager,
  // All the crap
  EagerWithChildren
}

export enum RelationType {
  One,
  OneExclusive,
  Many,
  ManyExclusive
}

export class EnumerationsStub {
}
