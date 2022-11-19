import { Request, Response } from 'express'
import userRepository from '@addressbook/api/repositories/userRepository'
import { writeJsonResponse } from '@addressbook/utils/express'
import logger from '@addressbook/utils/logger'

export type ErrorResponse = { error: { type: string; message: string } }

function registerUser(input: any, res: Response): void {
    const loginData = {
        email: input.email.toLowerCase(),
        password: input.password,
    }

    userRepository
        .createUser(loginData)
        .then((resp) => {
            if ((resp as any).error) {
                if (
                    (resp as ErrorResponse).error.type ===
                    'account_already_exists'
                ) {
                    writeJsonResponse(res, 409, resp)
                } else {
                    throw new Error(`unsupported ${resp}`)
                }
            } else {
                const { userId, token, expireAt } = resp as {
                    userId: string
                    token: string
                    expireAt: Date
                }
                //writeJsonResponse(res, 200, {userId: _id, token: token}, {'X-Expires-After': expireAt.toISOString()})
                writeJsonResponse(res, 200, {
                    userId: userId,
                    token: token,
                    expireAt: expireAt,
                })
            }
        })
        .catch((err: any) => {
            logger.error(`createUser: ${err}`)
            writeJsonResponse(res, 500, {
                error: {
                    type: 'internal_server_error',
                    message: 'Internal Server Error',
                },
            })
        })
}

export function login(input: any, res: Response): void {
    const loginData = {
        email: input.email.toLowerCase(),
        password: input.password,
    }

    userRepository
        .login(loginData)
        .then((resp) => {
            if ((resp as any).error) {
                if (
                    (resp as ErrorResponse).error.type === 'invalid_credentials'
                ) {
                    writeJsonResponse(res, 404, resp)
                } else {
                    throw new Error(`unsupported ${resp}`)
                }
            } else {
                const { userId, token, expireAt } = resp as {
                    userId: string
                    token: string
                    expireAt: Date
                }
                //writeJsonResponse(res, 200, {userId: _id, token: token}, {'X-Expires-After': expireAt.toISOString()})
                writeJsonResponse(res, 200, {
                    userId: userId,
                    token: token,
                    expireAt: expireAt,
                })
            }
        })
        .catch((err: any) => {
            logger.error(`login: ${err}`)
            writeJsonResponse(res, 500, {
                error: {
                    type: 'internal_server_error',
                    message: 'Internal Server Error',
                },
            })
        })
}

export default {
    registerUser: registerUser,
    login: login,
}