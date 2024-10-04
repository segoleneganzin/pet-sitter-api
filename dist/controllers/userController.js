"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.createUser = void 0;
const userService = __importStar(require("../services/userService.js"));
const utilsController_js_1 = require("../utils/utilsController.js");
const createUser = (req, res) => {
    (0, utilsController_js_1.handleResponseCreate)('userController', res, userService.createUser(req));
};
exports.createUser = createUser;
const getUserById = (req, res) => {
    const successMessage = 'User retrieved successfully';
    (0, utilsController_js_1.handleResponse)('userController', res, userService.getUserById(req), successMessage);
};
exports.getUserById = getUserById;
const updateUser = (req, res) => {
    const successMessage = 'User updated successully';
    (0, utilsController_js_1.handleResponse)('userController', res, userService.updateUser(req), successMessage);
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    const successMessage = '';
    (0, utilsController_js_1.handleResponse)('userController', res, userService.deleteUser(req), successMessage);
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map