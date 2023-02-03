import credentials from '@addressbook/config/firestore/key.json'
import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert(credentials as admin.ServiceAccount),
})

export const _db = admin.firestore()