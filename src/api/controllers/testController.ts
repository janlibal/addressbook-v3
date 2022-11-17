import {Request, Response} from 'express'
import {writeJsonResponse} from '@addressbook/utils/express'
 
export function test(req: Request, res: Response): void {
  const name = req.query.name || 'stranger'
  writeJsonResponse(res, 200, {"message": `Hello, ${name}!`})
}
