//import credentials from '@addressbook/config/firestore/key.json'
import credentials from '../../config/firestore/key.json'

import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert(credentials as admin.ServiceAccount),
})

const _db = admin.firestore()


export default _db