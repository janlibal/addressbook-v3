"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const userRepository_1 = __importDefault(require("@addressbook/api/repositories/userRepository"));
const express_1 = require("@addressbook/utils/express");
const logger_1 = __importDefault(require("@addressbook/utils/logger"));
function registerUser(input, res) {
    const loginData = {
        email: input.email.toLowerCase(),
        password: input.password,
    };
    userRepository_1.default
        .createUser(loginData)
        .then((resp) => {
        if (resp.error) {
            if (resp.error.type ===
                'account_already_exists') {
                (0, express_1.writeJsonResponse)(res, 409, resp);
            }
            else {
                throw new Error(`unsupported ${resp}`);
            }
        }
        else {
            const { userId, token, expireAt } = resp;
            //writeJsonResponse(res, 200, {userId: _id, token: token}, {'X-Expires-After': expireAt.toISOString()})
            (0, express_1.writeJsonResponse)(res, 200, {
                userId: userId,
                token: token,
                expireAt: expireAt,
            });
        }
    })
        .catch((err) => {
        logger_1.default.error(`createUser: ${err}`);
        (0, express_1.writeJsonResponse)(res, 500, {
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        });
    });
}
function login(input, res) {
    const loginData = {
        email: input.email.toLowerCase(),
        password: input.password,
    };
    userRepository_1.default
        .login(loginData)
        .then((resp) => {
        if (resp.error) {
            if (resp.error.type === 'invalid_credentials') {
                (0, express_1.writeJsonResponse)(res, 404, resp);
            }
            else {
                throw new Error(`unsupported ${resp}`);
            }
        }
        else {
            const { userId, token, expireAt } = resp;
            //writeJsonResponse(res, 200, {userId: _id, token: token}, {'X-Expires-After': expireAt.toISOString()})
            (0, express_1.writeJsonResponse)(res, 200, {
                userId: userId,
                token: token,
                expireAt: expireAt,
            });
        }
    })
        .catch((err) => {
        logger_1.default.error(`login: ${err}`);
        (0, express_1.writeJsonResponse)(res, 500, {
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        });
    });
}
exports.login = login;
exports.default = {
    registerUser: registerUser,
    login: login,
};
