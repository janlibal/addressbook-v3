"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContact = void 0;
const express_1 = require("@addressbook/utils/express");
const addressRepository_1 = __importDefault(require("@addressbook/api/repositories/addressRepository"));
const logger_1 = __importDefault(require("@addressbook/utils/logger"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
function addContact(input, res) {
    const userEmail = userRepository_1.default.getUserEmail(input.userId);
    const fullName = input.lastName + ', ' + input.firstName;
    const contactData = {
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNo: input.phoneNo,
        address: input.address,
    };
    const userData = {
        userEmail: userEmail,
        fullName: fullName,
        userId: input.userId,
    };
    addressRepository_1.default.saveContact(contactData, userData)
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
            const { userId, email, firstName, lastName, phoneNo, address } = resp;
            //writeJsonResponse(res, 200, {userId: _id, token: token}, {'X-Expires-After': expireAt.toISOString()})
            (0, express_1.writeJsonResponse)(res, 200, {
                userId,
                email,
                firstName,
                lastName,
                phoneNo,
                address,
            });
        }
    })
        .catch((err) => {
        logger_1.default.error(`saveContact: ${err}`);
        (0, express_1.writeJsonResponse)(res, 500, {
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        });
    });
}
exports.addContact = addContact;
exports.default = {
    addContact: addContact,
};
