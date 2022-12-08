import express from 'express'
import { test } from '@addressbook/api/controllers/testController'
import {login, createUser} from '@addressbook/api/controllers/userController'
import { validate } from '@addressbook/middleware/validate'
import { createUserSchema, loginUserSchema } from '@addressbook/schemas/userSchema'



const router = express.Router()

router.get('/test', test)
router.post('/user', validate(createUserSchema), createUser)
router.post('/login', validate(loginUserSchema), login)

export default router