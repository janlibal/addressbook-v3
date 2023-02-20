import { Request, Response, NextFunction } from 'express'
import userRepository from '@addressbook/repositories/userRepository'
import userOperations from '@addressbook/operations/userOperations'
import { writeJsonResponse } from '@addressbook/utils/express'
import logger from '@addressbook/utils/logger'




export async function createUser(req: Request, res: Response, next: NextFunction) {
    
    const input = {
        email: req.body.email,
        password: req.body.password,
    }

    try {
    
        const response = await userOperations.createUser(input)

        //writeJsonResponse(res, 200, { "response": user })
        writeJsonResponse(res, 200, {
            userId: response.userId,
            token: response.token,
            expireAt: response.expireAt,
        })

    } catch (err: any) {
        logger.error(`createUser: ${err}`)
        writeJsonResponse(res, 500, {
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        })
    }
    
}



export async function login(req: Request, res: Response, next: NextFunction) {
    
    const input = {
        email: req.body.email,
        password: req.body.password,
    }

    try {
    
        const response = await userOperations.login(input)

        //writeJsonResponse(res, 200, { "response": login })
        writeJsonResponse(res, 200, { userId: response.userId, token: response.token, expireAt: response.expireAt })

    } catch (err: any) {
        logger.error(`login: ${err}`)
        writeJsonResponse(res, 500, {
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        })
    }
    
}








