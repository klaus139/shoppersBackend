"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_1 = __importDefault(require("./routes/users"));
const index_1 = __importDefault(require("./routes/index"));
const Admin_1 = __importDefault(require("./routes/Admin"));
const vendor_1 = __importDefault(require("./routes/vendor"));
const index_2 = require("./config/index");
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//sequelize connection
index_2.db.sync().then(() => {
    console.log("Connection to database established");
}).catch(err => {
    console.log(err);
});
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
//router middleware
app.use('/', index_1.default);
app.use('/users', users_1.default);
app.use('/admins', Admin_1.default);
app.use('/vendors', vendor_1.default);
//kill all node ------ to stop all servers
const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
