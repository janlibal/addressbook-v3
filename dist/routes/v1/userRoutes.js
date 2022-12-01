"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testController_1 = require("@addressbook/api/controllers/testController");
const userController_1 = require("@addressbook/api/controllers/userController");
const validate_1 = require("@addressbook/middleware/validate");
const userSchema_1 = require("@addressbook/schemas/userSchema");
const router = express_1.default.Router();
router.get('/test', testController_1.test);
router.post('/user', (0, validate_1.validate)(userSchema_1.createUserSchema), userController_1.createUser);
router.post('/login', (0, validate_1.validate)(userSchema_1.loginUserSchema), userController_1.login);
//router.post('/contact', validate(createAddressSchema), contact)
exports.default = router;
