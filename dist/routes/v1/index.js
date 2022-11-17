"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testController_1 = require("@addressbook/api/controllers/testController");
const router = express_1.default.Router();
router.get('/test', testController_1.test);
exports.default = router;
