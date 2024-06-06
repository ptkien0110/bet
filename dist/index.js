"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("./middlewares/error.middleware");
const index_routes_1 = __importDefault(require("./routes/common/index.routes"));
const index_routes_2 = __importDefault(require("./routes/user/index.routes"));
const database_services_1 = __importDefault(require("./services/database.services"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_routes_3 = __importDefault(require("./routes/admin/index.routes"));
const app = (0, express_1.default)();
const port = 4000;
database_services_1.default.connect();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001"], // Đổi theo frontend của bạn
    credentials: true, // Cho phép gửi cookie
};
app.use((0, cors_1.default)(corsOptions));
const routes = [{ ...index_routes_2.default }, { ...index_routes_1.default }, { ...index_routes_3.default }];
routes.forEach((item) => item.routes.forEach((route) => app.use(item.prefix + route.path, route.route)));
app.use(error_middleware_1.defaultErrorHandler);
app.get("/", (req, res) => {
    res.send("Hello World! back end ");
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
