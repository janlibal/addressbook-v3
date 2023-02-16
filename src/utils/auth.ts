import fs from 'fs'
import jwt, { SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken'

import { User } from '@addressbook/models/userModel'
import config from '@addressbook/config'
import logger from '@addressbook/utils/logger'
import { writeJsonResponse } from './express'
import { NextFunction, Request, Response } from 'express'

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



export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization!
    getPayload(token)
        .then((authResponse) => {
            if (!(authResponse as any).error) {
                res.locals.auth = {
                    userId: (authResponse as { userId: string }).userId,
                }
                next()
            } else {
                writeJsonResponse(res, 401, authResponse)
            }
        })
        .catch((err) => {
            writeJsonResponse(res, 500, {
                error: {
                    type: 'internal_server_error',
                    message: 'Internal Server Error',
                },
            })
        })
}


function getPayload(bearerToken: string): Promise<AuthResponse> {
    return new Promise(function (resolve, reject) {
        const token = bearerToken.replace('Bearer ', '')
        jwt.verify(token, publicKey, verifyOptions, (err: VerifyErrors | null, decoded: any | undefined) => {
            if (err === null && decoded !== undefined) {
                if (decoded.userId) {
                    resolve({
                        userId: decoded.userId,
                        expireAt: decoded.exp
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



function createAuthToken(data: any): Promise<{ userId: string; token: string; expireAt: Date }> {
    return new Promise(function (resolve, reject) {
        let userId:string
        if(!data._id){
            userId = data
        } else {
            userId = data._id
        }
        jwt.sign({ userId: userId }, privateSecret, signOptions, (err: Error | null, encoded: string | undefined) => {
                if (err === null && encoded !== undefined) {
                    const expireAfter = 2 * 604800 // two weeks 
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
export default {
    authenticate: authenticate,
    createAuthToken: createAuthToken,
}