"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddressSchema = void 0;
const zod_1 = require("zod");
exports.createAddressSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        firstName: (0, zod_1.string)({
            required_error: 'First Name is required!',
        }),
        lastName: (0, zod_1.string)({
            required_error: 'Last Name is required!',
        }),
        phoneNo: (0, zod_1.string)({
            required_error: 'Phone Number is required',
        }),
        address: (0, zod_1.string)({
            required_error: 'Address is required',
        }),
    }),
});
