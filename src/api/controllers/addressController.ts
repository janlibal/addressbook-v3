import { Request, Response, NextFunction } from 'express'
import addressOperations from '@addressbook/api/operations/addressOperations'

export async function contact(req: Request, res: Response, next: NextFunction) {

    const userId = res.locals.auth.userId

    const input = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNo: req.body.phoneNo,
        address: req.body.address,
        userId: userId
    }

    try {

        await addressOperations.addContact(input, res)

    } catch (e) {

        return next(e)

    }
}


