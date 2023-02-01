import express from 'express'
import { test } from '@addressbook/api/controllers/testController'
import { validate } from '@addressbook/middleware/validate'
import { createAddressSchema } from '@addressbook/schemas/addressSchema'
import { auth } from '@addressbook/api/controllers/userController'

const router = express.Router()

router.use(auth)

router.get('/test', test)


export default router