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
const userModel_1 = __importDefault(require("@addressbook/api/models/userModel"));
const db_1 = __importDefault(require("@addressbook/utils/db"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.open();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.close();
}));
describe('save', () => {
    it('1. should create user', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = (0, falso_1.randEmail)();
        const password = (0, falso_1.randPassword)();
        const before = Date.now();
        const user = new userModel_1.default({ email: email, password: password });
        yield user.save();
        //const after = Date.now()
        const fetched = yield userModel_1.default.findById(user._id);
        expect(fetched).not.toBeNull();
        expect(fetched.email).toBe(email);
        expect(fetched.password).not.toBe(password);
        //expect(before).toBeLessThanOrEqual(fetched!.created.getTime())
        //expect(fetched!.created.getTime()).toBeLessThanOrEqual(after)
    }));
    it('2. should not save user with invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = new userModel_1.default({
            email: 'email@em.o',
            password: (0, falso_1.randPassword)(),
        });
        yield expect(user1.save()).rejects.toThrowError(/do not match email regex/);
    }));
    it('3. should not save user without an email', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = new userModel_1.default({ password: (0, falso_1.randPassword)() });
        yield expect(user.save()).rejects.toThrowError(/email/);
    }));
    it('4. should not save user without a password', () => __awaiter(void 0, void 0, void 0, function* () {
        const user2 = new userModel_1.default({ email: (0, falso_1.randEmail)() });
        yield expect(user2.save()).rejects.toThrowError(/password/);
    }));
    it('5. should not save user with the same email', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = (0, falso_1.randEmail)();
        const password = (0, falso_1.randPassword)();
        const userData = { email: email, password: password };
        const user1 = new userModel_1.default(userData);
        yield user1.save();
        const user2 = new userModel_1.default(userData);
        yield expect(user2.save()).rejects.toThrowError(/E11000/);
    }));
    it('6. should not save password in a readable form', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = (0, falso_1.randPassword)();
        const user1 = new userModel_1.default({ email: (0, falso_1.randEmail)(), password: password });
        yield user1.save();
        expect(user1.password).not.toBe(password);
        const user2 = new userModel_1.default({ email: (0, falso_1.randEmail)(), password: password });
        yield user2.save();
        expect(user2.password).not.toBe(password);
        expect(user1.password).not.toBe(user2.password);
    }));
});
describe('comparePassword', () => {
    it('7. should return true for valid password', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = (0, falso_1.randPassword)();
        const user = new userModel_1.default({ email: (0, falso_1.randEmail)(), password: password });
        yield user.save();
        expect(yield user.comparePassword(password)).toBe(true);
    }));
    it('8. should return false for invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = new userModel_1.default({ email: (0, falso_1.randEmail)(), password: (0, falso_1.randPassword)() });
        yield user.save();
        expect(yield user.comparePassword((0, falso_1.randPassword)())).toBe(false);
    }));
    it('9. should update password hash if password is updated', () => __awaiter(void 0, void 0, void 0, function* () {
        const password1 = (0, falso_1.randPassword)();
        const user = new userModel_1.default({ email: (0, falso_1.randEmail)(), password: password1 });
        const dbUser1 = yield user.save();
        expect(yield dbUser1.comparePassword(password1)).toBe(true);
        const password2 = (0, falso_1.randPassword)();
        dbUser1.password = password2;
        const dbUser2 = yield dbUser1.save();
        expect(yield dbUser2.comparePassword(password2)).toBe(true);
        expect(yield dbUser2.comparePassword(password1)).toBe(false);
    }));
});
describe('toJSON', () => {
    it('10. should return valid JSON', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = (0, falso_1.randEmail)();
        const password = (0, falso_1.randPassword)();
        const user = new userModel_1.default({ email: email, password: password });
        yield user.save();
        expect(user.toJSON()).toEqual({ email: email });
    }));
});
