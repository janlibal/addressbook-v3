import { User } from '@addressbook/api/models/userModel'
import logger from '@addressbook/utils/logger'
import credentials from '@addressbook/config/firestore/key.json'
import admin from 'firebase-admin'

export type ErrorResponse = { error: { type: string, message: string } }
export type SaveContactResponse = ErrorResponse | { userId: string, firstName: string, lastName: string, phoneNo: number, address: string, }
export type ExtractContactsResponse = ErrorResponse | { data: any }


admin.initializeApp({
    credential: admin.credential.cert(credentials as admin.ServiceAccount),
})

const _db = admin.firestore()


async function retrieveContacts(userData: any): Promise<ExtractContactsResponse> {
    try {
        const user = await User.findOne({ _id: userData.userId })

        if (!user) {
            return {
                error: {
                    type: 'invalid_credentials',
                    message: 'User does not exist',
                },
            }
        }


        const snapshot = await _db.collection(userData.userId).get()
        const data =  snapshot.docs.map(doc => doc.data())
        
        //const data = await _db.collection(userData.userId).get()
      
        return {
            data: data
        }

    } catch (err) {
        logger.error(`extractContacts: ${err}`)
        return Promise.reject({
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        })
    }
}


async function saveContact(contactData: any, userData: any): Promise<SaveContactResponse> {
    try {
        const user = await User.findOne({ _id: userData.userId })

        if (!user) {
            return {
                error: {
                    type: 'invalid_credentials',
                    message: 'User does not exist',
                },
            }
        }

        await _db.collection(userData.userId).doc(userData.fullName).set(contactData)
      
        return {
            userId: userData.userId.toString(),
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            phoneNo: contactData.phoneNo,
            address: contactData.address,
        }

    } catch (err) {
        logger.error(`saveContact: ${err}`)
        return Promise.reject({
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        })
    }
}

export default {
    saveContact: saveContact,
    retrieveContacts: retrieveContacts
}
