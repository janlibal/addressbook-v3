"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("@addressbook/routes/index"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const morgan_body_1 = __importDefault(require("morgan-body"));
const config_1 = __importDefault(require("@addressbook/config"));
const express_dev_logger_1 = require("@addressbook/utils/express_dev_logger");
const swagger_1 = __importDefault(require("@addressbook/routes/v1/swagger"));
function createServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = (0, express_1.default)();
        server.use(body_parser_1.default.json());
        if (config_1.default.morganLogger) {
            server.use((0, morgan_1.default)(':method :url :status :response-time ms - :res[content-length]'));
        }
        if (config_1.default.morganBodyLogger) {
            (0, morgan_body_1.default)(server);
        }
        if (config_1.default.addressBookDevLogger) {
            server.use(express_dev_logger_1.expressDevLogger);
        }
        (0, index_1.default)(server);
        (0, swagger_1.default)(server, 3000);
        return server;
    });
}
exports.createServer = createServer;
