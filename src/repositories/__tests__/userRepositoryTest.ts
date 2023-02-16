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
    /*it('1. should resolve with true and valid userId for valid token', async () => {
        const dummy = await createDummyAndAuthorize()

        await expect(userRepository.auth(dummy.token)).resolves.toEqual({
            //userId: dummy._id,
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            expireAt: expect.any(Number),
        })
    })*/

    /*it('2. should resolve with false for invalid token', async () => {
        const response = await userRepository.auth('invalidToken')
        expect(response).toEqual({
            error: { type: 'unauthorized', message: 'Authentication Failed' },
        })
    })*/
})

describe('findUserByEmail', () => {
    
    it('1. Should find user by email', async () => {
        
        const dummyUser = await createDummy()
        
        const credentials = {
            email: dummyUser.email,
            password: dummyUser.password
        }

        const user = userRepository.findByEmail(credentials)

        expect(user).not.toBeNull()
    })

    it('2. Should not find user with an invalid email', async () => {

        const credentials = {
            email: 'aa@bb.'
        }

        let error = null

        try {
          const user = await userRepository.findByEmail(credentials)
          await user?.validate()
        } catch (e) {
          error = e
        }
      
        expect(error).toBeNull()
        
    })

    it('3. Should not find user without email provided', async () => {

        const credentials = {
            //email: 'aa@bb.'
        }

        let error = null

        try {
          const user = await userRepository.findByEmail(credentials)
          await user?.validate()
        } catch (e) {
          error = e
        }
      
        expect(error).toBeNull()
        
    })

    

})

describe('saveUser', () => {
    
    it('1. Should save user', async () => {
        
        const credentials = {
            email: randEmail(),
            password: randPassword()
        }

        const user = await userRepository.saveUser(credentials)

        expect(user).not.toBeNull()

        expect(user!.email).toBe(credentials.email)

        expect(user!.password).not.toBe(credentials.password)
    })

    it('2. Should not save user without valid email', async () => {

        const credentials = {
            email: 'aa@bb.',
            password: randPassword()
        }

        let error = null

        try {
          const user = await userRepository.saveUser(credentials)
          await user.validate()
        } catch (e) {
          error = e
        }
      
        expect(error).not.toBeNull()
        
    })

    it('3. Should not save user without a password', async () => {

        const credentials = {
            email: randEmail(),
        }

        let error = null

        try {
          const user = await userRepository.saveUser(credentials)
          await user.validate()
        } catch (e) {
          error = e
        }
      
        expect(error).not.toBeNull()
        
    })

    it('4. Should not save user without an email', async () => {

        const credentials = {
            //email: 'aa@bb.',
            password: randPassword()
        }

        let error = null

        try {
          const user = await userRepository.saveUser(credentials)
          await user.validate()
        } catch (e) {
          error = e
        }
      
        expect(error).not.toBeNull()
        
    })

    it('5. Should not save user with no credentials provided', async () => {

        const credentials = {
            //email: 'aa@bb.',
            //password: randPassword()
        }

        let error = null

        try {
          const user = await userRepository.saveUser(credentials)
          await user.validate()
        } catch (e) {
          error = e
        }
      
        expect(error).not.toBeNull()
        
    })

   

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

    /*it('4. should resolve with false & valid error if duplicate', async () => {
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
    })*/

    /*it('5. should reject if invalid input', async () => {
        const userData = {
            email: 'em@em.c',
            password: randPassword(),
        }

        await expect(userRepository.createUser(userData)).rejects.toThrowError(
            'validation failed'
        )
    })*/
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

    /*it('7. should reject with error if login does not exist', async () => {
        const dummyUser = await createDummy

        await expect(userRepository.login(dummyUser)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'Invalid Login/Password',
            },
        })
    })*/

    /*it('8. should reject with error if password is wrong', async () => {
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
    })*/
})
