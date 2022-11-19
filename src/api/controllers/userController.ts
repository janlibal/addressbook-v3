import { Request, Response, NextFunction } from 'express'
import userRepository from '@addressbook/api/repositories/userRepository'
import userOperations from '@addressbook/api/operations/userOperations'
import { writeJsonResponse } from '@addressbook/utils/express'
import logger from '@addressbook/utils/logger'


export function auth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization!
  userRepository
      .auth(token)
      .then((authResponse) => {
          if (!(authResponse as any).error) {
              res.locals.auth = {
                  userId: (authResponse as { userId: string }).userId,
              }
              next()
          } else {
              writeJsonResponse(res, 401, authResponse)
          }
      })
      .catch((err) => {
          writeJsonResponse(res, 500, {
              error: {
                  type: 'internal_server_error',
                  message: 'Internal Server Error',
              },
          })
      })
}


export async function login(req: Request, res: Response, next: NextFunction) {
  const input = {
      email: req.body.email,
      password: req.body.password,
  }

  try {
      await userOperations.login(input, res)
      //return res.status(201).json(user);
  } catch (e) {
      return next(e)
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const input = {
      email: req.body.email,
      password: req.body.password,
  }

  try {
      await userOperations.registerUser(input, res)
  } catch (e) {
      return next(e)
  }
}