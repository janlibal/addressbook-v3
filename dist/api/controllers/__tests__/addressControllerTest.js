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
const falso_1 = require("@ngneat/falso");
const supertest_1 = __importDefault(require("supertest"));
const db_1 = __importDefault(require("@addressbook/utils/db"));
const server_1 = require("@addressbook/utils/server");
const user_1 = require("@addressbook/tests/user");
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.open();
    server = yield (0, server_1.createServer)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.close();
}));
/*beforeEach(async () => {
    jest.setTimeout(20000)
})*/
describe('POST /contact', () => {
    it('1. should return 200 & valid response if request param list is correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_1.createDummyAndAuthorize)();
        const input = {
            firstName: (0, falso_1.randFirstName)(),
            lastName: (0, falso_1.randLastName)(),
            phoneNo: (0, falso_1.randPhoneNumber)(),
            address: (0, falso_1.randStreetAddress)(),
            userId: user._id
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body).toMatchObject({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            firstName: expect.any(String),
            lastName: expect.any(String),
            phoneNo: expect.any(String),
            address: expect.any(String),
        });
    }));
    it('2. should return 401 if authorization is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const userToken = null;
        const input = {
            firstName: (0, falso_1.randFirstName)(),
            lastName: (0, falso_1.randLastName)(),
            phoneNo: (0, falso_1.randPhoneNumber)(),
            address: (0, falso_1.randStreetAddress)(),
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(401);
        expect(res.body).toMatchObject({
            error: {
                type: 'unauthorized',
                message: 'Authentication Failed',
            },
        });
    }));
    it('3. should return 400 if firstname is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_1.createDummyAndAuthorize)();
        const input = {
            firstName: 123456,
            lastName: (0, falso_1.randLastName)(),
            phoneNo: (0, falso_1.randPhoneNumber)(),
            address: (0, falso_1.randStreetAddress)(),
            userId: user._id
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    message: 'Expected string, received number',
                    path: ['body', 'firstName']
                }]
        });
    }));
    it('3. should return 400 if lastname is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_1.createDummyAndAuthorize)();
        const input = {
            firstName: (0, falso_1.randFirstName)(),
            lastName: 1234657,
            phoneNo: (0, falso_1.randPhoneNumber)(),
            address: (0, falso_1.randStreetAddress)(),
            userId: user._id
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    message: 'Expected string, received number',
                    path: ['body', 'lastName']
                }]
        });
    }));
    it('4. should return 400 if phone number is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_1.createDummyAndAuthorize)();
        const input = {
            firstName: (0, falso_1.randFirstName)(),
            lastName: (0, falso_1.randLastName)(),
            phoneNo: 1212545,
            address: (0, falso_1.randStreetAddress)(),
            userId: user._id
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    message: 'Expected string, received number',
                    path: ['body', 'phoneNo']
                }]
        });
    }));
    it('5. should return 400 if address is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_1.createDummyAndAuthorize)();
        const input = {
            firstName: (0, falso_1.randFirstName)(),
            lastName: (0, falso_1.randLastName)(),
            phoneNo: (0, falso_1.randPhoneNumber)(),
            address: 4567890,
            userId: user._id
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    message: 'Expected string, received number',
                    path: ['body', 'address']
                }]
        });
    }));
    it('6. should return 400 if firstname is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_1.createDummyAndAuthorize)();
        const input = {
            lastName: (0, falso_1.randLastName)(),
            phoneNo: (0, falso_1.randPhoneNumber)(),
            address: (0, falso_1.randStreetAddress)(),
            userId: user._id
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                    message: 'First Name is required!',
                    path: ['body', 'firstName']
                }]
        });
    }));
    it('7. should return 400 if lastname is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_1.createDummyAndAuthorize)();
        const input = {
            firstName: (0, falso_1.randFirstName)(),
            phoneNo: (0, falso_1.randPhoneNumber)(),
            address: (0, falso_1.randStreetAddress)(),
            userId: user._id
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                    message: 'Last Name is required!',
                    path: ['body', 'lastName']
                }]
        });
    }));
    it('8. should return 400 if phone number is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_1.createDummyAndAuthorize)();
        const input = {
            firstName: (0, falso_1.randFirstName)(),
            lastName: (0, falso_1.randLastName)(),
            address: (0, falso_1.randStreetAddress)(),
            userId: user._id
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                    message: 'Phone Number is required',
                    path: ['body', 'phoneNo']
                }]
        });
    }));
    it('9. should return 400 if address is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_1.createDummyAndAuthorize)();
        const input = {
            firstName: (0, falso_1.randFirstName)(),
            lastName: (0, falso_1.randLastName)(),
            phoneNo: (0, falso_1.randPhoneNumber)(),
            userId: user._id
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                    message: 'Address is required',
                    path: ['body', 'address']
                }]
        });
    }));
});
