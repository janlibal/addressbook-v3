import User from '@addressbook/api/models/userModel'
import userRepository from '@addressbook/api/repositories/userRepository'
import { randCompanyName, randEmail, randFirstName, randLastName, randPassword } from '@ngneat/falso'

type DummyUser = { email: string; password: string; userId: string }

type AuthorizedDummyUser = {
    email: string
    password: string
    userId: string
    token: string
}
type AuthorizedRegisteredUser = {
    token: string
    userId: string
    expireAt: Date
}

export function dummy() {

    const firstName = randFirstName().toLowerCase()
    const lastName = randLastName().toLocaleLowerCase()
    const companyFullName = randCompanyName().toLocaleLowerCase()
    const company = companyFullName.substring(0,4)

    const email = firstName + '.' + lastName + '@' + company + '.com'.toString()
        
    return {
        email: randEmail(),
        password: randPassword(),
    }
}


export async function createDummy(): Promise<DummyUser> {
    const user = dummy()
    const dbUser = new User(user)
    await dbUser.save()
    return { ...user, userId: dbUser._id.toString() }
}

export async function createDummyAndAuthorize(): Promise<AuthorizedDummyUser> {
    const user = await createDummy()
    const userData = {
        userId: user.userId,
    }

    const authToken = await userRepository.createAuthToken(userData)
    return {
        ...user,
        token: authToken.token,
    }
}

export async function authorizeUser(usrId: string): Promise<AuthorizedRegisteredUser> {
    const userData = {
        userId: usrId,
    }

    const authToken = await userRepository.createAuthToken(userData)
    return {
        userId: authToken.userId,
        expireAt: authToken.expireAt,
        token: authToken.token,
    }
}
