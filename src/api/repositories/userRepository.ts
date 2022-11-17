import fs from 'fs'
import jwt, { SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken'

import { User } from '@addressbook/api/models/userModel'
import config from '@addressbook/config'
import logger from '@addressbook/utils/logger'

export type ErrorResponse = { error: { type: string; message: string } }
export type CreateUserResponse = ErrorResponse | { userId: string; token: string; expireAt: Date }
export type LoginUserResponse = ErrorResponse | { userId: string; token: string; expireAt: Date }
export type AuthResponse = ErrorResponse | { expireAt: number; userId: string }
export type GetUserEmailResponse = ErrorResponse |  {email: string}


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
    algorithms: ['RS256'],
}



async function getUserEmail(data: any): Promise<GetUserEmailResponse> {
    try {
        const user = await User.findOne({ _id: data.userId })

        if (!user) {
            return {
                error: {
                    type: 'invalid_credentials',
                    message: 'User does not exist',
                },
            }
        }

        return {
            //userId: user._id.toString(),
            email: user.email,
        }

       

    } catch (err) {
        logger.error(`getUserEmail: ${err}`)
        return Promise.reject({
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        })
    }
}



function createAuthToken(data: any): Promise<{ userId: string; token: string; expireAt: Date }> {
    return new Promise(function (resolve, reject) {
        const userId = data._id ?? data.userId
        jwt.sign(
            { userId: userId },
            privateSecret,
            signOptions,
            (err: Error | null, encoded: string | undefined) => {
                if (err === null && encoded !== undefined) {
                    const expireAfter = 2 * 604800 /* two weeks */
                    const expireAt = new Date()
                    expireAt.setSeconds(expireAt.getSeconds() + expireAfter)
                    resolve({
                        userId: userId,
                        token: encoded,
                        expireAt: expireAt,
                    })
                } else {
                    reject(err)
                }
            }
        )
    })
}

async function login(input: any): Promise<LoginUserResponse> {
    const userData = {
        email: input.email,
        password: input.password,
    }

    try {
        const user = await User.findOne({ email: userData.email })
        if (!user) {
            return {
                error: {
                    type: 'invalid_credentials',
                    message: 'Invalid Login/Password',
                },
            }
        }

        const passwordMatch = await user.comparePassword(userData.password)
        if (!passwordMatch) {
            return {
                error: {
                    type: 'invalid_credentials',
                    message: 'Invalid Login/Password',
                },
            }
        }

        const authToken = await createAuthToken(user._id.toString())
        return {
            userId: user._id.toString(),
            token: authToken.token,
            expireAt: authToken.expireAt,
        }
    } catch (err) {
        logger.error(`login: ${err}`)
        return Promise.reject({
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        })
    }
}


function auth(bearerToken: string): Promise<AuthResponse> {
    return new Promise(function (resolve, reject) {
        const token = bearerToken.replace('Bearer ', '')
        //jwt.verify(token, publicKey, verifyOptions, (err: VerifyErrors | null, decoded: object | undefined) => {
        jwt.verify(token, publicKey, verifyOptions, (err, decoded) => {
            if (err === null && decoded !== undefined) {
                const d = decoded as { userId?: string; exp: number }
                //const d = decoded as {exp: number}
                console.log('decoded userId:' + d.exp)
                if (d.userId) {
                    //if (d.exp) {
                    resolve({
                        userId: d.userId,
                        expireAt: d.exp,
                    })
                    return
                }
            }
            resolve({
                error: {
                    type: 'unauthorized',
                    message: 'Authentication Failed',
                },
            })
        })
    })
}

function createUser(input: any): Promise<CreateUserResponse> {
    const userData = {
        email: input.email,
        password: input.password,
    }

    return new Promise(function (resolve, reject) {
        const user = new User({
            email: userData.email,
            password: userData.password,
        })
        user.save()
            .then(createAuthToken)
            .then(function (login) {
                resolve({
                    userId: login.userId.toString(),
                    token: login.token,
                    expireAt: login.expireAt,
                })
            })
            /*.then(u => {
        //const result = {userId: u._id.toString()}
        //return result
        resolve({
          userId: u._id.toString()
        })
      })*/
            .catch((err) => {
                if (err.code === 11000) {
                    resolve({
                        error: {
                            type: 'account_already_exists',
                            message: `${userData.email} already exists`,
                        },
                    })
                } else {
                    logger.error(`createUser: ${err}`)
                    reject(err)
                }
            })
    })
}

export default {
     createUser: createUser,
     auth:auth,
     login: login,
     createAuthToken: createAuthToken,
     getUserEmail: getUserEmail
}