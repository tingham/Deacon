var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Exception = /** @class */ (function (_super) {
    __extends(Exception, _super);
    function Exception() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Exception;
}(Error));
export { Exception };
var ContentException = /** @class */ (function (_super) {
    __extends(ContentException, _super);
    function ContentException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ContentException;
}(Exception));
export { ContentException };
var BeginResultException = /** @class */ (function (_super) {
    __extends(BeginResultException, _super);
    function BeginResultException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BeginResultException;
}(ContentException));
export { BeginResultException };
var EndResultException = /** @class */ (function (_super) {
    __extends(EndResultException, _super);
    function EndResultException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EndResultException;
}(ContentException));
export { EndResultException };
var InvalidLikeValueException = /** @class */ (function (_super) {
    __extends(InvalidLikeValueException, _super);
    function InvalidLikeValueException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidLikeValueException;
}(Exception));
export { InvalidLikeValueException };
var DriverNotConnectedException = /** @class */ (function (_super) {
    __extends(DriverNotConnectedException, _super);
    function DriverNotConnectedException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DriverNotConnectedException;
}(Exception));
export { DriverNotConnectedException };
var InvalidDriverException = /** @class */ (function (_super) {
    __extends(InvalidDriverException, _super);
    function InvalidDriverException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidDriverException;
}(Exception));
export { InvalidDriverException };
var NotImplementedException = /** @class */ (function (_super) {
    __extends(NotImplementedException, _super);
    function NotImplementedException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NotImplementedException;
}(Exception));
export { NotImplementedException };
var InvalidArgumentsException = /** @class */ (function (_super) {
    __extends(InvalidArgumentsException, _super);
    function InvalidArgumentsException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidArgumentsException;
}(Exception));
export { InvalidArgumentsException };
var InvalidTypeAssignmentException = /** @class */ (function (_super) {
    __extends(InvalidTypeAssignmentException, _super);
    function InvalidTypeAssignmentException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidTypeAssignmentException;
}(Exception));
export { InvalidTypeAssignmentException };
var EmptyBuffer = /** @class */ (function (_super) {
    __extends(EmptyBuffer, _super);
    function EmptyBuffer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EmptyBuffer;
}(Exception));
export { EmptyBuffer };
var ExpectationFailure = /** @class */ (function (_super) {
    __extends(ExpectationFailure, _super);
    function ExpectationFailure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ExpectationFailure;
}(Exception));
export { ExpectationFailure };
var ImprintIdentityOrphaned = /** @class */ (function (_super) {
    __extends(ImprintIdentityOrphaned, _super);
    function ImprintIdentityOrphaned() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ImprintIdentityOrphaned;
}(Exception));
export { ImprintIdentityOrphaned };
var InvalidInstance = /** @class */ (function (_super) {
    __extends(InvalidInstance, _super);
    function InvalidInstance() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidInstance;
}(Exception));
export { InvalidInstance };
var UnregisteredRenderer = /** @class */ (function (_super) {
    __extends(UnregisteredRenderer, _super);
    function UnregisteredRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UnregisteredRenderer;
}(Exception));
export { UnregisteredRenderer };
var ViewRenderError = /** @class */ (function (_super) {
    __extends(ViewRenderError, _super);
    function ViewRenderError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ViewRenderError.FromError = function (type, error) {
        var viewRenderError = new ViewRenderError("The view could not be rendered from ".concat(type, ". Original Message: ").concat(error.message));
        viewRenderError.stack = error.stack;
        return viewRenderError;
    };
    return ViewRenderError;
}(Exception));
export { ViewRenderError };
var InvalidTemplate = /** @class */ (function (_super) {
    __extends(InvalidTemplate, _super);
    function InvalidTemplate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidTemplate;
}(Exception));
export { InvalidTemplate };
//# sourceMappingURL=Exception.js.map