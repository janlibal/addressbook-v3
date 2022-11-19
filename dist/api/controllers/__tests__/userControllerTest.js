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
const user_1 = require("@addressbook/tests/user");
const falso_1 = require("@ngneat/falso");
const supertest_1 = __importDefault(require("supertest"));
const db_1 = __importDefault(require("@addressbook/utils/db"));
const server_1 = require("@addressbook/utils/server");
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.open();
    server = yield (0, server_1.createServer)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.close();
}));
describe('POST /api/v1/user', () => {
    it('1. should return 201 & valid response for valid user', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: (0, falso_1.randEmail)(),
            password: (0, falso_1.randPassword)(),
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/user`)
            .send(userData)
            .expect(200);
        expect(res.body).toMatchObject({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
            expireAt: expect.any(String), //expireAt: expect.any(Date),
        });
    }));
    it('2. should return 409 & valid response for duplicated user', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            email: (0, falso_1.randEmail)(),
            password: (0, falso_1.randPassword)(),
        };
        yield (0, supertest_1.default)(server).post(`/api/v1/user`).send(data);
        expect(200);
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/user`)
            .send(data)
            .expect(409);
        expect(res.body).toMatchObject({
            error: {
                type: 'account_already_exists',
                message: expect.stringMatching(/already exists/),
            },
        });
    }));
    it('3. should return 400 & valid response for invalid request', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            email: null,
            password: (0, falso_1.randPassword)(),
        };
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/user`)
            .send(data)
            .expect(400);
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    message: 'Expected string, received null',
                    path: ['body', 'email']
                }]
        });
    }));
});
describe('POST /api/v1/login', () => {
    it('4. should return 200 & valid response for a valid login request', () => __awaiter(void 0, void 0, void 0, function* () {
        const dummy = yield (0, user_1.createDummy)();
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/login`)
            .send({
            email: dummy.email,
            password: dummy.password,
        })
            .expect(200);
        //expect(res.header['x-expires-after']).toMatch(/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/)
        expect(res.body).toEqual({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
            expireAt: expect.any(String),
        });
    }));
    it('5. should return 404 & valid response for a non-existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/login`)
            .send({
            email: (0, falso_1.randEmail)(),
            password: (0, falso_1.randPassword)(),
        })
            .expect(404);
        expect(res.body).toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'Invalid Login/Password',
            },
        });
    }));
    it('6. should return 400 & valid response for invalid request', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server)
            .post(`/api/v1/login`)
            .send({
            email: 123465,
            password: (0, falso_1.randPassword)()
        })
            .expect(400);
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    message: 'Expected string, received number',
                    path: ['body', 'email']
                }]
            /*error: {
              type: 'request_validation',
              message: expect.stringMatching(/email/)
              }*/
        });
    }));
});
/*describe('login failure', () => {
  it('should return 500 & valid response if auth rejects with an error', async () => {
    (userRepository.login as jest.Mock).mockResolvedValue({error: {type: 'unknown'}})
    const res = await request(server)
      .post(`/api/v1/login`)
      .send({
        email: randEmail(),
        password: randPassword()
      })
      .expect(500)
      expect(res.body).toMatchObject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  })
})*/
