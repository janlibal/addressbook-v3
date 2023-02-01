import admin from 'firebase-admin'
import credentials from '@addressbook/config/firestore/key.json'


admin.initializeApp({
    credential: admin.credential.cert(credentials as admin.ServiceAccount),
})

export const _db = admin.firestore()

