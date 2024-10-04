"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const connection_js_1 = require("./database/connection.js");
const sitterRoutes_js_1 = __importDefault(require("./routes/sitterRoutes.js"));
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js"));
const ownerRoutes_js_1 = __importDefault(require("./routes/ownerRoutes.js"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
dotenv_1.default.config();
const swaggerDocs = yamljs_1.default.load('./swagger.yaml');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, connection_js_1.dbConnection)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port :${PORT}`);
    });
})
    .catch((err) => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
});
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
const staticFilesDirectory = path_1.default.join(__dirname, '../public/uploads');
app.use('/api/v1/uploads', express_1.default.static(staticFilesDirectory));
// Request payload middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Handle custom routes
app.use('/api/v1/users/sitters', sitterRoutes_js_1.default);
app.use('/api/v1/users/owners', ownerRoutes_js_1.default);
app.use('/api/v1/users', userRoutes_js_1.default);
app.use('/api/v1/auth', authRoutes_js_1.default);
// API Documentation
if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
}
app.get('/', (req, res) => {
    res.send('Hello from my Express server API!');
});
//# sourceMappingURL=api.js.map