"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const customError_js_1 = require("../utils/customError.js");
const userModel_js_1 = require("../database/models/userModel.js");
const deleteFile_js_1 = require("../utils/deleteFile.js");
const formatWord_js_1 = require("../utils/formatWord.js");
const utilsUser_js_1 = require("../utils/utilsUser.js");
const createUser = async (req) => {
    try {
        const { body, file } = req;
        // Check if email already exists
        if (await userModel_js_1.UserModel.findOne({ email: body.email })) {
            throw new customError_js_1.CustomError(409, 'Email already exists');
        }
        if (!body.password) {
            throw new customError_js_1.CustomError(400, 'Password is required');
        }
        (0, utilsUser_js_1.validateRoleData)(body);
        const hashPassword = await bcrypt_1.default.hash(body.password, 12);
        body.password = hashPassword;
        (0, utilsUser_js_1.handleRoleData)(body);
        const newUser = new userModel_js_1.UserModel((0, utilsUser_js_1.prepareUserData)(body, file));
        await newUser.save();
        return newUser;
    }
    catch (error) {
        console.error('Error in createUser:', error.message);
        throw error;
    }
};
exports.createUser = createUser;
const getUserById = async (req) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new customError_js_1.CustomError(400, 'Invalid ID supplied');
        }
        const user = await userModel_js_1.UserModel.findById(id);
        if (!user) {
            throw new customError_js_1.CustomError(404, 'User not found');
        }
        return user;
    }
    catch (error) {
        console.error('Error in getUserById:', error);
        throw error;
    }
};
exports.getUserById = getUserById;
const updateUser = async (req) => {
    try {
        const { body, file, token } = req;
        const user = await userModel_js_1.UserModel.findById(token?.id);
        if (!user) {
            throw new customError_js_1.CustomError(404, 'User not found');
        }
        (0, utilsUser_js_1.validateRoleData)(body);
        (0, utilsUser_js_1.handleRoleData)(body);
        if (file) {
            const oldImagePath = `./public/uploads/profilePicture${user.profilePicture}`;
            (0, deleteFile_js_1.deleteFile)(oldImagePath);
            user.profilePicture = `/${file.filename}`;
        }
        user.firstName = (0, formatWord_js_1.capitalizeFirstLetter)(body.firstName) || user.firstName;
        user.lastName = (0, formatWord_js_1.capitalizeFirstLetter)(body.lastName) || user.lastName;
        user.city = (0, formatWord_js_1.capitalizeFirstLetter)(body.city) || user.city;
        user.country = (0, formatWord_js_1.capitalizeFirstLetter)(body.country) || user.country;
        if (user.roles.includes('sitter') && user.roleDetails.sitter) {
            user.roleDetails.sitter.tel = body.tel || user.roleDetails.sitter.tel;
            user.roleDetails.sitter.presentation =
                body.presentation || user.roleDetails.sitter.presentation;
            user.roleDetails.sitter.acceptedPets =
                body.acceptedPets || user.roleDetails.sitter.acceptedPets;
        }
        if (user.roles.includes('owner') && user.roleDetails.owner) {
            user.roleDetails.owner.pets = body.pets || user.roleDetails.owner.pets;
        }
        const updatedUser = await user.save();
        if (!updatedUser) {
            throw new customError_js_1.CustomError(404, 'User not found');
        }
        return updatedUser;
    }
    catch (error) {
        console.error('Error in updateUser:', error.message);
        throw error;
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req) => {
    try {
        const { token } = req;
        const user = await userModel_js_1.UserModel.findById(token?.id);
        if (!user) {
            throw new customError_js_1.CustomError(404, 'User not found');
        }
        // const isValid = await bcrypt.compare(body.password, user.password);
        // if (body.email !== user.email || !isValid) {
        //   throw new CustomError(400, 'Invalid email/password supplied');
        // }
        await userModel_js_1.UserModel.findByIdAndDelete(user.id);
    }
    catch (error) {
        console.error('Error in deleteUser:', error.message);
        throw error;
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userService.js.map