import { Request, Response } from 'express'
import userRepository from '@addressbook/repositories/userRepository'
import auth from '@addressbook/utils/auth'
import { writeJsonResponse } from '@addressbook/utils/express'
import logger from '@addressbook/utils/logger'
import User from '@addressbook/models/userModel'

export type ErrorResponse = { error: { type: string; message: string } }



async function createUser(input: any) {
    
    const userData = {
        email: input.email.toLowerCase(),
        password: input.password,
    }

    const existingUser = await userRepository.findByEmail(userData)
    if (existingUser) {
        return {
            error: {
                type: 'account_already_exists',
                message: `${userData.email} already exists`,
            }
        }
    }

    const createdUser = await userRepository.saveUser(userData)
    
    const authToken = await auth.createAuthToken(createdUser._id.toString())

    return {
        userId: createdUser._id.toString(),
        token: authToken.token,
        expireAt: authToken.expireAt,
    }

}


export async function login(input:any) {
    
    const loginData = {
        email: input.email,
        password: input.password,
    }
    const user = await userRepository.findByEmail(loginData)
    if (!user) {
        return {
            error: {
                type: 'invalid_credentials',
                message: 'Invalid Login/Password',
            },
        }
    }
    
    const passwordMatch = await user.comparePassword(loginData.password)

    if (!passwordMatch) {
        return {
            error: {
                type: 'invalid_credentials',
                message: 'Invalid Login/Password',
            },
        }
    }

    

   
    const authToken = await auth.createAuthToken(user._id.toString())
    
    return {
        userId: user._id.toString(),
        token: authToken.token,
        expireAt: authToken.expireAt,
    }
        
  }









export default {
    login: login,
    createUser: createUser
}