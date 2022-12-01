"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRoutes_1 = __importDefault(require("@addressbook/routes/v1/userRoutes"));
const addressRoutes_1 = __importDefault(require("@addressbook/routes/v1/addressRoutes"));
function default_1(server) {
    server.use('/api/v1', userRoutes_1.default);
    server.use('/api/v1', addressRoutes_1.default);
}
exports.default = default_1;
