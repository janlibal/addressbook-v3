import userRepository from '../userRepository'
import { randEmail, randPassword } from '@ngneat/falso'
import db from '@addressbook/utils/db'
import { createDummy, createDummyAndAuthorize } from '@addressbook/tests/user'

beforeAll(async () => {
    await db.open()
})

afterAll(async () => {
    await db.close()
})


describe('auth', () => {
    it('1. should resolve with true and valid userId for valid token', async () => {
        const dummy = await createDummyAndAuthorize()

        await expect(userRepository.auth(dummy.token)).resolves.toEqual({
            //userId: dummy._id,
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            expireAt: expect.any(Number),
        })
    })

    it('2. should resolve with false for invalid token', async () => {
        const response = await userRepository.auth('invalidToken')
        expect(response).toEqual({
            error: { type: 'unauthorized', message: 'Authentication Failed' },
        })
    })
})

describe('createUser', () => {
    /*it('3. should resolve with true and valid userId', async () => {
        const userData = {
            email: randEmail(),
            password: randPassword(),
        }

        await expect(userRepository.createUser(userData)).resolves.toEqual({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/ ),
            expireAt: expect.any(Date)
        })
    })*/

    it('4. should resolve with false & valid error if duplicate', async () => {
        const userData = {
            email: randEmail(),
            password: randPassword(),
        }

        await userRepository.createUser(userData)

        await expect(userRepository.createUser(userData)).resolves.toEqual({
            error: {
                type: 'account_already_exists',
                message: `${userData.email} already exists`,
            },
        })
    })

    it('5. should reject if invalid input', async () => {
        const userData = {
            email: 'em@em.c',
            password: randPassword(),
        }

        await expect(userRepository.createUser(userData)).rejects.toThrowError(
            'validation failed'
        )
    })
})

describe('login', () => {
    /*it('6. should return JWT token, userId, expireAt to a valid login/password', async () => {
        const dummyUser = await createDummy()
        const credentials = {
            email: dummyUser.email,
            password: dummyUser.password
        }

        await expect(userRepository.login(credentials)).resolves.toEqual({
            userId: dummyUser._id,
            token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
            expireAt: expect.any(Date)
        })
    })*/

    it('7. should reject with error if login does not exist', async () => {
        const dummyUser = await createDummy

        await expect(userRepository.login(dummyUser)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'Invalid Login/Password',
            },
        })
    })

    it('8. should reject with error if password is wrong', async () => {
        const dummyUser = await createDummy()

        const usr = {
            email: dummyUser.email,
            password: 'pwd123',
        }

        await expect(userRepository.login(usr)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'Invalid Login/Password',
            },
        })
    })
})
