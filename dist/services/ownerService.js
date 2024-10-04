"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerById = exports.getAllOwners = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customError_js_1 = require("../utils/customError.js");
const userModel_js_1 = require("../database/models/userModel.js");
const getAllOwners = async () => {
    try {
        const owners = await userModel_js_1.UserModel.find({ roles: 'owner' });
        return owners;
    }
    catch (error) {
        console.error('Error in getAllOwners:', error.message);
        throw new customError_js_1.CustomError(500, 'Failed to retrieve Owners. Please try again later.');
    }
};
exports.getAllOwners = getAllOwners;
const getOwnerById = async (req) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new customError_js_1.CustomError(400, 'Invalid ID supplied');
        }
        const owner = await userModel_js_1.UserModel.findById(id);
        if (!owner) {
            throw new customError_js_1.CustomError(404, 'Owner not found');
        }
        return owner;
    }
    catch (error) {
        console.error('Error in getOwnerById:', error.message);
        throw error;
    }
};
exports.getOwnerById = getOwnerById;
// TODO delete owner role
//# sourceMappingURL=ownerService.js.map