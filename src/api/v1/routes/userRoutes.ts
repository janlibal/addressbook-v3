import express from 'express'
import { login, createUser } from '@addressbook/controllers/userController'
import { validate } from '@addressbook/middleware/validate'
import { createUserSchema, loginUserSchema } from '@addressbook/schemas/userSchema'



const router = express.Router()

router.post('/login', validate(loginUserSchema), login)
router.post('/user', validate(createUserSchema), createUser)

export default router