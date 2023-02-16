import { Request, Response, NextFunction } from 'express'
import addressOperations from '@addressbook/operations/addressOperations'
import { writeJsonResponse } from '@addressbook/utils/express'
import logger from '@addressbook/utils/logger'


export async function createContact(req: Request, res: Response, next: NextFunction) {
    try {

        const userId = res.locals.auth.userId

        const input = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNo: req.body.phoneNo,
            address: req.body.address,
            userId: userId
        }

        const response = await addressOperations.createContact(input)

        writeJsonResponse(res, 200, { "response": response })

    } catch (err: any) {
        logger.error(`createContact: ${err}`)
        writeJsonResponse(res, 500, {
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        })
    }
}



export async function getContacts(req: Request, res: Response, next: NextFunction) {
    
    const userId = res.locals.auth.userId

    try {
    
        const contacts = await addressOperations.getMyContacts(userId)

        writeJsonResponse(res, 200, { "response": contacts })

    } catch (err: any) {
        logger.error(`getContacts: ${err}`)
        writeJsonResponse(res, 500, {
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        })
    }
    
}