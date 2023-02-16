import { Request, Response } from 'express'
import { writeJsonResponse } from '@addressbook/utils/express'
import addressRepository from '@addressbook/repositories/addressRepository'
import logger from '@addressbook/utils/logger'


export type ErrorResponse = { error: { type: string; message: string } }



export function getMyContacts(userId: string) {
    
    const userData = {
        userId: userId
    }

    const contacts = addressRepository.getMyContacts(userData)

    return contacts

}



async function createContact(input: any) {
    
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
  
    
    const contact = await addressRepository.create(contactData, userData)
    
    return contact
}


export default {
    createContact: createContact,
    getMyContacts: getMyContacts
}











