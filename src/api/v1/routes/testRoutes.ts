import express from 'express'
import { test } from '@addressbook/controllers/testController'

const router = express.Router()

router.get('/test', test)

export default router