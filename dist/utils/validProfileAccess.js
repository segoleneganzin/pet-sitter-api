"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validProfileAccess = void 0;
const userModel_js_1 = require("../database/models/userModel.js");
const customError_js_1 = require("./customError.js");
const validProfileAccess = async ({ tokenId, userId, }) => {
    try {
        const user = await userModel_js_1.UserModel.findById(tokenId);
        if (!user) {
            throw new customError_js_1.CustomError(404, 'User not found');
        }
        if (!userId.equals(user.id)) {
            throw new customError_js_1.CustomError(401, 'Unauthorized access');
        }
    }
    catch (error) {
        throw error;
    }
};
exports.validProfileAccess = validProfileAccess;
//# sourceMappingURL=validProfileAccess.js.map