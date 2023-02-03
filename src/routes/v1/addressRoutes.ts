import express from 'express'
import { contact, getContacts } from '@addressbook/api/controllers/addressController'
import { validate } from '@addressbook/middleware/validate'
import { createAddressSchema } from '@addressbook/schemas/addressSchema'
import { auth } from '@addressbook/api/controllers/userController'

const router = express.Router()

router.use(auth)
router.get('/contact', getContacts)
router.post('/contact', validate(createAddressSchema), contact)

export default router