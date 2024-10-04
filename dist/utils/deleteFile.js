"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const deleteFile = (filePath) => {
    try {
        // not delete default files
        const defaultProfilePicturePath = './public/uploads/profilePicture/default-profile-picture.png';
        if (filePath !== defaultProfilePicturePath) {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            else {
                console.log(`File not found: ${filePath}`);
            }
        }
    }
    catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
    }
};
exports.deleteFile = deleteFile;
//# sourceMappingURL=deleteFile.js.map