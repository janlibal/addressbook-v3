import express from 'express'
import { createContact, getContacts  } from '@addressbook/controllers/addressController'
import { validate } from '@addressbook/middleware/validate'
import { createAddressSchema } from '@addressbook/schemas/addressSchema'

import { authenticate } from '@addressbook/utils/auth'

const router = express.Router()

router.use(authenticate)
router.get('/contact', getContacts)
router.post('/contact', validate(createAddressSchema), createContact)


export default router