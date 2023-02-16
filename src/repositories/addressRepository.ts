import { User } from '@addressbook/models/userModel'
import logger from '@addressbook/utils/logger'
import credentials from '@addressbook/config/firestore/key.json'
import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert(credentials as admin.ServiceAccount),
})

const _db = admin.firestore()


export type ErrorResponse = { error: { type: string, message: string } }
export type SaveContactResponse = ErrorResponse | { userId: string, firstName: string, lastName: string, phoneNo: number, address: string, }
export type ExtractContactsResponse = ErrorResponse | { data: any }



async function getMyContacts(userData: any) {
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
                      
        return {
            data: data
        }

    } catch (err) {
        logger.error(`findMyContacts: ${err}`)
        return Promise.reject({
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        })
    }
  }

  async function create(contactData: any, userData: any) {

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


    const contact = await _db.collection(userData.userId).doc(userData.fullName).set(contactData)
  
    return {
        userId: userData.userId.toString(),
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        phoneNo: contactData.phoneNo,
        address: contactData.address,
        contact: contact
    }

    } catch (err) {
        logger.error(`create: ${err}`)
        return Promise.reject({
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error',
            },
        })
    }
}










export default {
    create: create,
    getMyContacts: getMyContacts
}
