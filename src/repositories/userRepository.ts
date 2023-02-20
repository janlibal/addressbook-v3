import fs from 'fs'
import jwt, { SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken'

import { User } from '@addressbook/models/userModel'

import config from '@addressbook/config'
import logger from '@addressbook/utils/logger'


export type ErrorResponse = { error: { type: string; message: string } }
export type CreateUserResponse = ErrorResponse | { userId: string; token: string; expireAt: Date; }
export type LoginUserResponse = ErrorResponse | { userId: string; token: string; expireAt: Date;  }
export type AuthResponse = ErrorResponse | { userId: string; expireAt: Date }

const privateKey = fs.readFileSync(config.privateKeyFile)
const privateSecret = {
    key: privateKey,
    passphrase: config.privateKeyPassphrase,
}
const signOptions: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '14d',
}

const publicKey = fs.readFileSync(config.publicKeyFile)
const verifyOptions: VerifyOptions = {
    algorithms: ['RS256']
}


async function findUserById(userData: any) {
    const user =  await User.findOne({ _id: userData.userId })
    return user
}

async function findUserByEmail(userData: any) {
    const user =  await User.findOne({email: userData.email})
    return user
}


async function saveUser(userData: any) {
    const user = new User({
        email: userData.email,
        password: userData.password,
    })
    
    await user.save()
  
    return user
}


export default {
     saveUser: saveUser,
     findUserByEmail: findUserByEmail,
     findUserById: findUserById
}