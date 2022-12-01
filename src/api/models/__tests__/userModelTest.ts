import { randEmail, randPassword } from '@ngneat/falso'

import User from '@addressbook/api/models/userModel'
import db from '@addressbook/utils/db'

beforeAll(async () => {
    await db.open()
})

afterAll(async () => {
    await db.close()
})

describe('save', () => {
    it('1. should create user', async () => {
        const email = randEmail()
        const password = randPassword()

        const before = Date.now()

        const user = new User({ email: email, password: password })
        await user.save()

        //const after = Date.now()

        const fetched = await User.findById(user._id)

        expect(fetched).not.toBeNull()

        expect(fetched!.email).toBe(email)

        expect(fetched!.password).not.toBe(password)

        //expect(before).toBeLessThanOrEqual(fetched!.created.getTime())
        //expect(fetched!.created.getTime()).toBeLessThanOrEqual(after)
    })

    it('2. should not save user with invalid email', async () => {
        const user1 = new User({
            email: 'email@em.o',
            password: randPassword(),
        })
        await expect(user1.save()).rejects.toThrowError(
            /do not match email regex/
        )
    })

    it('3. should not save user without an email', async () => {
        const user = new User({ password: randPassword() })
        await expect(user.save()).rejects.toThrowError(/email/)
    })

    it('4. should not save user without a password', async () => {
        const user2 = new User({ email: randEmail() })
        await expect(user2.save()).rejects.toThrowError(/password/)
    })

    it('5. should not save user with the same email', async () => {
        const email = randEmail()
        const password = randPassword()
        const userData = { email: email, password: password }

        const user1 = new User(userData)
        await user1.save()

        const user2 = new User(userData)
        await expect(user2.save()).rejects.toThrowError(/E11000/)
    })

    it('6. should not save password in a readable form', async () => {
        const password = randPassword()

        const user1 = new User({ email: randEmail(), password: password })
        await user1.save()
        expect(user1.password).not.toBe(password)

        const user2 = new User({ email: randEmail(), password: password })
        await user2.save()
        expect(user2.password).not.toBe(password)

        expect(user1.password).not.toBe(user2.password)
    })
})

describe('comparePassword', () => {
    it('7. should return true for valid password', async () => {
        const password = randPassword()
        const user = new User({ email: randEmail(), password: password })
        await user.save()
        expect(await user.comparePassword(password)).toBe(true)
    })

    it('8. should return false for invalid password', async () => {
        const user = new User({ email: randEmail(), password: randPassword() })
        await user.save()
        expect(await user.comparePassword(randPassword())).toBe(false)
    })

    it('9. should update password hash if password is updated', async () => {
        const password1 = randPassword()
        const user = new User({ email: randEmail(), password: password1 })
        const dbUser1 = await user.save()
        expect(await dbUser1.comparePassword(password1)).toBe(true)

        const password2 = randPassword()
        dbUser1.password = password2
        const dbUser2 = await dbUser1.save()
        expect(await dbUser2.comparePassword(password2)).toBe(true)
        expect(await dbUser2.comparePassword(password1)).toBe(false)
    })
})

describe('toJSON', () => {
    it('10. should return valid JSON', async () => {
        const email = randEmail()
        const password = randPassword()

        const user = new User({ email: email, password: password })
        await user.save()
        expect(user.toJSON()).toEqual({ email: email })
    })
})
