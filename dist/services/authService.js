"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLog = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customError_js_1 = require("../utils/customError.js");
const userModel_js_1 = require("../database/models/userModel.js");
const login = async (serviceData) => {
    try {
        const user = await userModel_js_1.UserModel.findOne({ email: serviceData.email });
        if (!user) {
            throw new customError_js_1.CustomError(404, 'User not found');
        }
        const isValid = await bcrypt_1.default.compare(serviceData.password, user.password);
        if (!isValid) {
            throw new customError_js_1.CustomError(401, 'Invalid email/password supplied');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id.toString() }, process.env.SECRET_KEY || 'default-secret-key', { expiresIn: '1d' });
        return { token };
    }
    catch (error) {
        console.error('Error in loginService', error);
        throw error;
    }
};
exports.login = login;
const updateLog = async (req) => {
    try {
        const { body, token } = req;
        const user = await userModel_js_1.UserModel.findById(token?.id);
        if (!user) {
            throw new customError_js_1.CustomError(404, 'User not found');
        }
        if (body) {
            if (body.email) {
                const existingEmail = await userModel_js_1.UserModel.findOne({ email: body.email });
                if (existingEmail && existingEmail.id !== user.id) {
                    throw new customError_js_1.CustomError(409, 'Email already exists');
                }
                user.email = body.email;
            }
            if (body.password) {
                user.password = await bcrypt_1.default.hash(body.password, 12);
            }
        }
        const updatedUser = await user.save();
        if (!updatedUser) {
            throw new customError_js_1.CustomError(500, 'Failed to update user');
        }
        return updatedUser;
    }
    catch (error) {
        console.error('Error in updateUser:', error.message);
        throw error;
    }
};
exports.updateLog = updateLog;
//# sourceMappingURL=authService.js.map