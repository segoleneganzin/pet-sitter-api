"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'CustomError';
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=customError.js.map