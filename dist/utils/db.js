"use strict";
/* istanbul ignore file */
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
const mongoose_1 = __importDefault(require("mongoose"));
//import {MongoMemoryServer} from 'mongodb-memory-server'
const config_1 = __importDefault(require("@addressbook/config"));
const logger_1 = __importDefault(require("@addressbook/utils/logger"));
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.set('debug', process.env.DEBUG !== undefined);
const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: config_1.default.mongo.useCreateIndex,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    autoIndex: config_1.default.mongo.autoIndex,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};
class MongoConnection {
    //private _mongoServer?: MongoMemoryServer
    static getInstance() {
        if (!MongoConnection._instance) {
            MongoConnection._instance = new MongoConnection();
        }
        return MongoConnection._instance;
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.debug('connecting to mongo db: ' + config_1.default.mongo.url);
                mongoose_1.default.connect(config_1.default.mongo.url, opts);
                mongoose_1.default.connection.on('connected', () => {
                    logger_1.default.info('Mongo: connected');
                });
                mongoose_1.default.connection.on('disconnected', () => {
                    logger_1.default.error('Mongo: disconnected');
                });
                mongoose_1.default.connection.on('error', (err) => {
                    logger_1.default.error(`Mongo:  ${String(err)}`);
                    if (err.name === 'MongoNetworkError') {
                        setTimeout(function () {
                            mongoose_1.default.connect(config_1.default.mongo.url, opts).catch(() => { });
                        }, 5000);
                    }
                });
            }
            catch (err) {
                logger_1.default.error(`db.open: ${err}`);
                throw err;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.disconnect();
            }
            catch (err) {
                logger_1.default.error(`db.open: ${err}`);
                throw err;
            }
        });
    }
}
exports.default = MongoConnection.getInstance();
