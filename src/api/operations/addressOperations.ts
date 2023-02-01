import { Request, Response } from 'express'
import { writeJsonResponse } from '@addressbook/utils/express'
import addressRepository from '@addressbook/api/repositories/addressRepository'
import logger from '@addressbook/utils/logger'


export type ErrorResponse = { error: { type: string; message: string } }

export function getMyContacts(userId: string, res: Response): void {

    const userData = {
        userId: userId
    }
    
    addressRepository.retrieveContacts(userData)
        .then((resp) => {
            if ((resp as any).error) {
                if ((resp as ErrorResponse).error.type === 'invalid_credentials') {
                    writeJsonResponse(res, 404, resp)
                } else {
                    throw new Error(`unsupported ${resp}`)
                }
            } else {
                const { 
                  data } = resp as { data: any
                }
                writeJsonResponse(res, 200, { data })
            }
        })
        .catch((err: any) => {
            logger.error(`saveContact: ${err}`)
            writeJsonResponse(res, 500, {
                error: {
                    type: 'internal_server_error',
                    message: 'Internal Server Error',
                },
            })
        })
}








export function addContact(input: any, res: Response): void {
    
    const fullName = input.lastName + ', ' + input.firstName


    const contactData = {
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNo: input.phoneNo,
        address: input.address,
    }

    const userData = {
        fullName: fullName,
        userId: input.userId,
    }

    

    addressRepository.saveContact(contactData, userData)
        .then((resp) => {
            if ((resp as any).error) {
                if ((resp as ErrorResponse).error.type === 'invalid_credentials') {
                    writeJsonResponse(res, 404, resp)
                } else {
                    throw new Error(`unsupported ${resp}`)
                }
            } else {
                const { 
                  userId, firstName, lastName, phoneNo, address } = resp as { userId: string, firstName: string, lastName: string, phoneNo: number, address: string
                }
                writeJsonResponse(res, 200, { userId, firstName, lastName, phoneNo, address })
            }
        })
        .catch((err: any) => {
            logger.error(`saveContact: ${err}`)
            writeJsonResponse(res, 500, {
                error: {
                    type: 'internal_server_error',
                    message: 'Internal Server Error',
                },
            })
        })
}

export default {
    addContact: addContact,
    getMyContacts: getMyContacts,
}
