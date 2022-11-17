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
function createServer() {
    return __awaiter(this, void 0, void 0, function* () {
        /*const yamlSpecFile = './config/v1docs.yml'
        const apiDefinition = YAML.load(yamlSpecFile)
        const apiSummary = summarise(apiDefinition)
        logger.info(apiSummary)*/
        const server = (0, express_1.default)();
        server.use(body_parser_1.default.json());
        /*if (config.morganLogger) {
          server.use(morgan(':method :url :status :response-time ms - :res[content-length]'))
        }
        
        if (config.morganBodyLogger) {
          morganBody(server)
        }
      
        if (config.addressBookDevLogger) {
          server.use(expressDevLogger)
        }*/
        (0, index_1.default)(server);
        //V1SwaggerDocs(server, 3000);
        return server;
    });
}
exports.createServer = createServer;
