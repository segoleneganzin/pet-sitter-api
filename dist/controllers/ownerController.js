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
exports.getOwnerById = exports.getAllOwners = void 0;
const ownerService = __importStar(require("../services/ownerService.js"));
const utilsController_js_1 = require("../utils/utilsController.js");
const getAllOwners = (req, res) => {
    const successMessage = 'Owners retrieved successfully';
    (0, utilsController_js_1.handleResponse)('ownerController', res, ownerService.getAllOwners(), successMessage);
};
exports.getAllOwners = getAllOwners;
const getOwnerById = async (req, res) => {
    const successMessage = 'Owner retrieved successfully';
    (0, utilsController_js_1.handleResponse)('ownerController', res, ownerService.getOwnerById(req), successMessage);
};
exports.getOwnerById = getOwnerById;
//# sourceMappingURL=ownerController.js.map