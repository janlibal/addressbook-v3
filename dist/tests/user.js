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
exports.authorizeUser = exports.createDummyAndAuthorize = exports.createDummy = exports.dummy = void 0;
const userModel_1 = __importDefault(require("@addressbook/api/models/userModel"));
const userRepository_1 = __importDefault(require("@addressbook/api/repositories/userRepository"));
const falso_1 = require("@ngneat/falso");
function dummy() {
    return {
        email: (0, falso_1.randEmail)(),
        password: 'password123456' //randPassword(),
    };
}
exports.dummy = dummy;
function createDummy() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = dummy();
        const dbUser = new userModel_1.default(user);
        yield dbUser.save();
        return {
            _id: dbUser._id.toString(),
            email: dbUser.email,
            password: dbUser.password,
        };
    });
}
exports.createDummy = createDummy;
function createDummyAndAuthorize() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield createDummy();
        const userData = {
            _id: user._id,
        };
        const authToken = yield userRepository_1.default.createAuthToken(userData);
        return {
            _id: userData._id,
            token: authToken.token
        };
    });
}
exports.createDummyAndAuthorize = createDummyAndAuthorize;
function authorizeUser(usrId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = {
            userId: usrId,
        };
        const authToken = yield userRepository_1.default.createAuthToken(userData);
        return {
            _id: authToken.userId,
            expireAt: authToken.expireAt,
            token: authToken.token,
        };
    });
}
exports.authorizeUser = authorizeUser;
