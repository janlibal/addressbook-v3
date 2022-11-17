"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const express_1 = require("@addressbook/utils/express");
const test = (req, res) => {
    const name = req.query.name || 'stranger';
    (0, express_1.writeJsonResponse)(res, 200, { "message": `Hello, ${name}!` });
};
exports.test = test;
