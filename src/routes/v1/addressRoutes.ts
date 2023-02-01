import express from 'express'
import { contact, getContacts } from '@addressbook/api/controllers/addressController'
import { validate } from '@addressbook/middleware/validate'
import { createAddressSchema } from '@addressbook/schemas/addressSchema'
import { auth } from '@addressbook/api/controllers/userController'

const router = express.Router()

router.use(auth)
router.post('/contact', validate(createAddressSchema), contact)
router.get('/contact', getContacts)


export default router