
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
