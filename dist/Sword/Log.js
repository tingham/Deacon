import winston from 'winston';
import chalk from 'chalk';
var Log = /** @class */ (function () {
    function Log() {
        this.Root = winston.createLogger({ level: 'info', format: winston.format.cli(), transports: [new winston.transports.Console()] });
    }
    Object.defineProperty(Log, "Instance", {
        get: function () {
            if (!this.instance) {
                this.instance = new Log();
            }
            return this.instance;
        },
        enumerable: false,
        configurable: true
    });
    Log.warn = function (location, message) {
        this.Instance.Root.warn("".concat(chalk.yellow(location), ": ").concat(message));
    };
    Log.info = function (location, message) {
        this.Instance.Root.info("".concat(chalk.cyan(location), ": ").concat(message));
    };
    Log.error = function (errorObject) {
        this.Instance.Root.error(errorObject);
    };
    return Log;
}());
export { Log };
//# sourceMappingURL=Log.js.map