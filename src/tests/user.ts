import User from '@addressbook/api/models/userModel'
import userRepository from '@addressbook/api/repositories/userRepository'
import { randCompanyName, randEmail, randFirstName, randLastName, randPassword } from '@ngneat/falso'

type DummyUser = { email: string; password: string; userId: string }

type AuthorizedDummyUser = { userId: string; token: string }
type AuthorizedRegisteredUser = { token: string;  userId: string; expireAt: Date }

export function dummy() {
        
    return {
        email: randEmail(),
        password: 'password123456' //randPassword(),
    }
}


export async function createDummy(): Promise<DummyUser> {
    const user = dummy()
    const dbUser = new User(user)
    await dbUser.save()
    return { 
        //...user, 
        userId: dbUser._id.toString(),
        email: dbUser.email,
        password: dbUser.password,
    }
}





export async function createDummyAndAuthorize(): Promise<AuthorizedDummyUser> {
    const user = await createDummy()
    const userData = {
        userId: user.userId,
    }

    const authToken = await userRepository.createAuthToken(userData)

    //console.log('userId: ' + userData.userId),
    //console.log('token: ' +authToken.token)

    return {
        //...user,
        userId: userData.userId,
        token: authToken.token
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
