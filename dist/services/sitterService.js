"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSitterById = exports.getAllSitters = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customError_js_1 = require("../utils/customError.js");
const userModel_js_1 = require("../database/models/userModel.js");
const getAllSitters = async () => {
    try {
        const sitters = await userModel_js_1.UserModel.find({ roles: 'sitter' });
        return sitters;
    }
    catch (error) {
        console.error('Error in getAllSitters:', error.message);
        throw new customError_js_1.CustomError(500, 'Failed to retrieve Sitters. Please try again later.');
    }
};
exports.getAllSitters = getAllSitters;
const getSitterById = async (req) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new customError_js_1.CustomError(400, 'Invalid ID supplied');
        }
        const sitter = await userModel_js_1.UserModel.findById(id);
        if (!sitter) {
            throw new customError_js_1.CustomError(404, 'Sitter not found');
        }
        return sitter;
    }
    catch (error) {
        console.error('Error in getSitterById:', error.message);
        throw error;
    }
};
exports.getSitterById = getSitterById;
// TODO delete sitter role
//# sourceMappingURL=sitterService.js.map