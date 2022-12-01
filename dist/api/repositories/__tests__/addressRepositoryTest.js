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
const addressRepository_1 = __importDefault(require("../addressRepository"));
const userRepository_1 = __importDefault(require("../userRepository"));
const db_1 = __importDefault(require("@addressbook/utils/db"));
const falso_1 = require("@ngneat/falso");
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
describe('Save Contact', () => {
    /*it('1. Returns the data to be saved plus Id of logged user.', async () => {

        const dummyUser = await createDummy()

        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: dummyUser.userId,
        }

        const getUserEmail = await userRepository.getUserEmail(input)

        const fullName = input.lastName + ', ' + input.firstName
        
        const contactData = {
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNo: input.phoneNo,
            address: input.address,
        }

        const userData = {
            email: getUserEmail,
            fullName: fullName,
            userId: input.userId
        }

        await expect(addressRepository.saveContact(contactData, userData)).resolves.toEqual({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            email: {
                email: expect.stringMatching(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i),
            },
            firstName: expect.any(String),
            lastName: expect.any(String),
            phoneNo: expect.any(String),
            address: expect.any(String),
        })

    })*/
    it('2. Returns user does not exist.', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = {
            firstName: (0, falso_1.randFirstName)(),
            lastName: (0, falso_1.randLastName)(),
            phoneNo: (0, falso_1.randPhoneNumber)(),
            address: (0, falso_1.randStreetAddress)(),
            userId: null,
        };
        const userEmail = userRepository_1.default.getUserEmail(input);
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
        yield expect(addressRepository_1.default.saveContact(contactData, userData)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'User does not exist',
            },
            //error: {type: 'internal_server_error', message: 'Internal Server Error'}
        });
    }));
});
describe('Get User Email', () => {
    it('1. Returns valid email of existing user incl. Id.', () => __awaiter(void 0, void 0, void 0, function* () {
        const dummyUser = yield (0, user_1.createDummy)();
        const userData = {
            userId: dummyUser.userId
        };
        yield expect(userRepository_1.default.getUserEmail(userData)).resolves.toEqual({
            //user: {
            //    email: expect.stringMatching(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i),
            //},
            email: expect.any(String)
        });
    }));
    it('2. Returns error for invalid user.', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            userId: null,
        };
        yield expect(userRepository_1.default.getUserEmail(userData)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'User does not exist',
            },
        });
    }));
});
