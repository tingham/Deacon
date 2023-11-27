
export class Exception extends Error { }
export class ContentException extends Exception { }
export class BeginResultException extends ContentException { }
export class EndResultException extends ContentException { }
export class InvalidLikeValueException extends Exception { }
export class DriverNotConnectedException extends Exception { }
export class InvalidDriverException extends Exception { }
export class NotImplementedException extends Exception { }
export class InvalidArgumentsException extends Exception { }
export class InvalidTypeAssignmentException extends Exception { }
export class EmptyBuffer extends Exception { }
export class ExpectationFailure extends Exception { }
export class ImprintIdentityOrphaned extends Exception { }
export class InvalidInstance extends Exception { }
export class UnregisteredRenderer extends Exception { }
export class EntityRenderError extends Exception { }

export class ViewRenderError extends Exception {
  public static FromError(type: string, error: Error): ViewRenderError {
    let viewRenderError = new ViewRenderError(
      `The view could not be rendered from ${type}. Original Message: ${error.message}`
    )
    viewRenderError.stack = error.stack
    return viewRenderError
  }
}
export class InvalidTemplate extends Exception { }
export class CSSError extends Exception {
  public static FromError(type: string, error: Error): ViewRenderError {
    let cssError = new CSSError(
      `The css could not be rendered from ${type}. Original Message: ${error.message}`
    )
    let table = []
    for (let key in error) {
      if ((error as any)[key] === undefined) continue
      if ((error as any)[key] instanceof Function) continue
      table.push([key, (error as any)[key]])
    }
    let longestKey = table.reduce((a, b) => a[0].length > b[0].length ? a : b)[0].length

    // Make a pretty table for stdout
    let tableRows = table.map(([key, value]) => `| ${key.padEnd(longestKey + 2)} | ${value} |`)

    cssError.stack = error.stack
    cssError.stack += `\n+${"-".padStart(tableRows[0].length - 2)}+\n${tableRows.join('\n')}`
    return cssError
  }
}
