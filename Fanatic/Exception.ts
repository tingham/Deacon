
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
