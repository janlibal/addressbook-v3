"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./utils/server");
const logger_1 = __importDefault(require("@addressbook/utils/logger"));
const config_1 = __importDefault(require("@addressbook/config"));
const db_1 = __importDefault(require("@addressbook/utils/db"));
db_1.default.open()
    .then(() => (0, server_1.createServer)())
    .then((server) => {
    server.listen(config_1.default.port, () => {
        logger_1.default.info(`Listening on http://localhost:${config_1.default.port}`);
    });
})
    .catch((err) => {
    logger_1.default.error(`Error: ${err}`);
});
