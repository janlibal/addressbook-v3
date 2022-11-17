import { NextFunction, Request, Response } from 'express'
import v1Routes from '@addressbook/routes/v1/index'


export default function (server: any) {
    server.use('/api/v1', v1Routes)
}
