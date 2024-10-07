"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const customError_1 = require("api/utils/customError");
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const errorMessage = 'Invalid file type. Only JPG, JPEG, and PNG files are allowed.';
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(new customError_1.CustomError(401, errorMessage));
    }
};
// Multer setup for file uploads
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `./public/uploads/${file.fieldname}`);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname);
        },
    }),
    fileFilter: fileFilter,
    // limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Set file size limit
});
// Error handling middleware for file upload errors
const handleError = (err, req, res, next) => {
    if (err) {
        res.status(400).send({
            status: 400,
            message: err.message,
        });
    }
    else {
        next();
    }
};
exports.handleError = handleError;
//# sourceMappingURL=uploadMiddleware.js.map