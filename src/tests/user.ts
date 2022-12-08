import User from '@addressbook/api/models/userModel'
import userRepository from '@addressbook/api/repositories/userRepository'
import { randEmail } from '@ngneat/falso'

type DummyUser = { email: string; password: string; _id: string }

type AuthorizedDummyUser = { _id: string; token: string }
type AuthorizedRegisteredUser = { token: string;  _id: string; expireAt: Date }

export function dummy() {
        
    return {
        email: randEmail({nameSeparator: '.'}),
        password: 'password12345678',
    }
}


export async function createDummy(): Promise<DummyUser> {
    const user = dummy()
    const dbUser = new User(user)
    await dbUser.save()
    return { 
         _id: dbUser._id.toString(),
        email: dbUser.email,
        password: dbUser.password,
    }
}

export async function createDummyAndAuthorize(): Promise<AuthorizedDummyUser> {
    const user = await createDummy()
    const userData = {
        _id: user._id,
    }

    const authToken = await userRepository.createAuthToken(userData)
    
    return {
         _id: userData._id,
        token: authToken.token
    }
}


export async function authorizeUser(usrId: string): Promise<AuthorizedRegisteredUser> {
    const userData = {
        userId: usrId,
    }

    const authToken = await userRepository.createAuthToken(userData)
    return {
        _id: authToken.userId,
        expireAt: authToken.expireAt,
        token: authToken.token,
    }
}