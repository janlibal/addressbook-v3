import admin from 'firebase-admin'
import credentials from '@addressbook/config/firestore/key.json'
import { User } from '@addressbook/api/models/userModel'
import logger from '@addressbook/utils/logger'

export type ErrorResponse = { error: { type: string, message: string } }
export type SaveContactResponse = ErrorResponse | { userId: string, email: string, firstName: string, lastName: string, phoneNo: number, address: string, }

admin.initializeApp({
    credential: admin.credential.cert(credentials as admin.ServiceAccount),
})

const _db = admin.firestore()


async function saveContact(
    contactData: any,
    userData: any
): Promise<SaveContactResponse> {
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
            email: userData.email,
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
    saveContact: saveContact
}
