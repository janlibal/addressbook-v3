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
const userRepository_1 = __importDefault(require("../userRepository"));
const falso_1 = require("@ngneat/falso");
const db_1 = __importDefault(require("@addressbook/utils/db"));
const user_1 = require("@addressbook/tests/user");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.open();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.close();
}));
/*beforeEach(async () => {
    jest.setTimeout(20000)
})*/
describe('auth', () => {
    it('1. should resolve with true and valid userId for valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const dummy = yield (0, user_1.createDummyAndAuthorize)();
        yield expect(userRepository_1.default.auth(dummy.token)).resolves.toEqual({
            //userId: dummy.userId
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            expireAt: expect.any(Number),
        });
    }));
    it('2. should resolve with false for invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield userRepository_1.default.auth('invalidToken');
        expect(response).toEqual({
            error: { type: 'unauthorized', message: 'Authentication Failed' },
        });
    }));
});
describe('createUser', () => {
    it('3. should resolve with true and valid userId', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: (0, falso_1.randEmail)(),
            password: (0, falso_1.randPassword)(),
        };
        yield expect(userRepository_1.default.createUser(userData)).resolves.toEqual({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
            expireAt: expect.any(Date),
        });
    }));
    it('4. should resolves with false & valid error if duplicate', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: (0, falso_1.randEmail)(),
            password: (0, falso_1.randPassword)(),
        };
        yield userRepository_1.default.createUser(userData);
        yield expect(userRepository_1.default.createUser(userData)).resolves.toEqual({
            error: {
                type: 'account_already_exists',
                message: `${userData.email} already exists`,
            },
        });
    }));
    it('5. should reject if invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: 'em@em.c',
            password: (0, falso_1.randPassword)(),
        };
        yield expect(userRepository_1.default.createUser(userData)).rejects.toThrowError('validation failed');
    }));
});
describe('login', () => {
    /*it('6. should return JWT token, userId, expireAt to a valid login/password', async () => {
        const dummyUser = await createDummy()
        const credentials = {
            email: dummyUser.email,
            password: dummyUser.password
        }
        
        await expect(userRepository.login(credentials)).resolves.toEqual({
            userId: dummyUser.userId,
            token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
            expireAt: expect.any(Date)
        })
    })*/
    it('7. should reject with error if login does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const dummyUser = yield user_1.createDummy;
        yield expect(userRepository_1.default.login(dummyUser)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'Invalid Login/Password',
            },
        });
    }));
    it('8. should reject with error if password is wrong', () => __awaiter(void 0, void 0, void 0, function* () {
        const dummyUser = yield (0, user_1.createDummy)();
        const usr = {
            email: dummyUser.email,
            password: 'pwd123',
        };
        yield expect(userRepository_1.default.login(usr)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'Invalid Login/Password',
            },
            //expireAt: expect.any(Date),
            //token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
            //userId: expect.stringMatching(/^[a-f0-9]{24}$/)
            //userId: dummyUser.userId
        });
    }));
});
