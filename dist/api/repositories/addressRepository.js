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
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const key_json_1 = __importDefault(require("@addressbook/config/firestore/key.json"));
const userModel_1 = require("@addressbook/api/models/userModel");
const logger_1 = __importDefault(require("@addressbook/utils/logger"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(key_json_1.default),
});
const _db = firebase_admin_1.default.firestore();
function saveContact(contactData, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.User.findOne({ _id: userData.userId });
            if (!user) {
                return {
                    error: {
                        type: 'invalid_credentials',
                        message: 'User does not exist',
                    },
                };
            }
            yield _db.collection(userData.userId).doc(userData.fullName).set(contactData);
            return {
                userId: userData.userId.toString(),
                email: userData.email,
                firstName: contactData.firstName,
                lastName: contactData.lastName,
                phoneNo: contactData.phoneNo,
                address: contactData.address,
            };
        }
        catch (err) {
            logger_1.default.error(`saveContact: ${err}`);
            return Promise.reject({
                error: {
                    type: 'internal_server_error',
                    message: 'Internal Server Error',
                },
            });
        }
    });
}
exports.default = {
    saveContact: saveContact
};
