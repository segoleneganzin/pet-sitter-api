"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.ATLAS_URI || '';
const dbConnection = async () => {
    try {
        await mongoose_1.default.connect(connectionString, {
            dbName: 'pet-sitter-db',
        });
    }
    catch (error) {
        console.error(`Database Connectivity Error: ${error}`);
        throw new Error(String(error));
    }
};
exports.dbConnection = dbConnection;
//# sourceMappingURL=connection.js.map