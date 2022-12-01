"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressController_1 = require("@addressbook/api/controllers/addressController");
const validate_1 = require("@addressbook/middleware/validate");
const addressSchema_1 = require("@addressbook/schemas/addressSchema");
const userController_1 = require("@addressbook/api/controllers/userController");
const router = express_1.default.Router();
router.use(userController_1.auth);
router.post('/contact', (0, validate_1.validate)(addressSchema_1.createAddressSchema), addressController_1.contact);
exports.default = router;
