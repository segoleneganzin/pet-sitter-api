"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customError_js_1 = require("../utils/customError.js");
// Middleware to validate JWT tokens
const validateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new customError_js_1.CustomError(400, 'Authorization header missing');
        }
        const jwtToken = authHeader.split('Bearer ')[1]?.trim();
        if (!jwtToken) {
            throw new customError_js_1.CustomError(401, 'Unauthorized: missing token');
        }
        const secretKey = process.env.SECRET_KEY || 'default-secret-key';
        // Decode and verify the JWT token
        const decodedJwtToken = jsonwebtoken_1.default.verify(jwtToken, secretKey);
        // Type assertion to ensure decodedJwtToken has id
        if (!('id' in decodedJwtToken)) {
            throw new customError_js_1.CustomError(401, 'JWT token does not contain an id');
        }
        // Add the decoded token information to the request object
        req.token = decodedJwtToken;
        next(); // Proceed to the next middleware
    }
    catch (error) {
        console.error('Error in token validation:', error);
        return res.status(401).send({
            status: 401,
            message: 'Unauthorized: Invalid or missing token',
        });
    }
};
exports.validateToken = validateToken;
//# sourceMappingURL=tokenValidation.js.map