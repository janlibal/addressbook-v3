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
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("@addressbook/api/models/userModel");
const config_1 = __importDefault(require("@addressbook/config"));
const logger_1 = __importDefault(require("@addressbook/utils/logger"));
const privateKey = fs_1.default.readFileSync(config_1.default.privateKeyFile);
const privateSecret = {
    key: privateKey,
    passphrase: config_1.default.privateKeyPassphrase,
};
const signOptions = {
    algorithm: 'RS256',
    expiresIn: '14d',
};
const publicKey = fs_1.default.readFileSync(config_1.default.publicKeyFile);
const verifyOptions = {
    algorithms: ['RS256'],
};
function getUserEmail(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.User.findOne({ _id: data.userId });
            if (!user) {
                return {
                    error: {
                        type: 'invalid_credentials',
                        message: 'User does not exist',
                    },
                };
            }
            return {
                //userId: user._id.toString(),
                email: user.email,
            };
        }
        catch (err) {
            logger_1.default.error(`getUserEmail: ${err}`);
            return Promise.reject({
                error: {
                    type: 'internal_server_error',
                    message: 'Internal Server Error',
                },
            });
        }
    });
}
function createAuthToken(data) {
    return new Promise(function (resolve, reject) {
        var _a;
        const userId = (_a = data._id) !== null && _a !== void 0 ? _a : data.userId;
        jsonwebtoken_1.default.sign({ userId: userId }, privateSecret, signOptions, (err, encoded) => {
            if (err === null && encoded !== undefined) {
                const expireAfter = 2 * 604800; /* two weeks */
                const expireAt = new Date();
                expireAt.setSeconds(expireAt.getSeconds() + expireAfter);
                resolve({
                    userId: userId,
                    token: encoded,
                    expireAt: expireAt,
                });
            }
            else {
                reject(err);
            }
        });
    });
}
function login(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = {
            email: input.email,
            password: input.password,
        };
        try {
            const user = yield userModel_1.User.findOne({ email: userData.email });
            if (!user) {
                return {
                    error: {
                        type: 'invalid_credentials',
                        message: 'Invalid Login/Password',
                    },
                };
            }
            const passwordMatch = yield user.comparePassword(userData.password);
            if (!passwordMatch) {
                return {
                    error: {
                        type: 'invalid_credentials',
                        message: 'Invalid Login/Password',
                    },
                };
            }
            const authToken = yield createAuthToken(user._id.toString());
            return {
                userId: user._id.toString(),
                token: authToken.token,
                expireAt: authToken.expireAt,
            };
        }
        catch (err) {
            logger_1.default.error(`login: ${err}`);
            return Promise.reject({
                error: {
                    type: 'internal_server_error',
                    message: 'Internal Server Error',
                },
            });
        }
    });
}
function auth(bearerToken) {
    return new Promise(function (resolve, reject) {
        const token = bearerToken.replace('Bearer ', '');
        //jwt.verify(token, publicKey, verifyOptions, (err: VerifyErrors | null, decoded: object | undefined) => {
        jsonwebtoken_1.default.verify(token, publicKey, verifyOptions, (err, decoded) => {
            if (err === null && decoded !== undefined) {
                const d = decoded;
                //const d = decoded as {exp: number}
                console.log('decoded userId:' + d.exp);
                if (d.userId) {
                    //if (d.exp) {
                    resolve({
                        userId: d.userId,
                        expireAt: d.exp,
                    });
                    return;
                }
            }
            resolve({
                error: {
                    type: 'unauthorized',
                    message: 'Authentication Failed',
                },
            });
        });
    });
}
function createUser(input) {
    const userData = {
        email: input.email,
        password: input.password,
    };
    return new Promise(function (resolve, reject) {
        const user = new userModel_1.User({
            email: userData.email,
            password: userData.password,
        });
        user.save()
            .then(createAuthToken)
            .then(function (login) {
            resolve({
                userId: login.userId.toString(),
                token: login.token,
                expireAt: login.expireAt,
            });
        })
            /*.then(u => {
        //const result = {userId: u._id.toString()}
        //return result
        resolve({
          userId: u._id.toString()
        })
      })*/
            .catch((err) => {
            if (err.code === 11000) {
                resolve({
                    error: {
                        type: 'account_already_exists',
                        message: `${userData.email} already exists`,
                    },
                });
            }
            else {
                logger_1.default.error(`createUser: ${err}`);
                reject(err);
            }
        });
    });
}
exports.default = {
    createUser: createUser,
    auth: auth,
    login: login,
    createAuthToken: createAuthToken,
    getUserEmail: getUserEmail
};
