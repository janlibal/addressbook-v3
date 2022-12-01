import { createDummy } from '@addressbook/tests/user'
import { randEmail, randPassword } from '@ngneat/falso'
import userRepository from '@addressbook/api/repositories/userRepository'
import request from 'supertest'
import { Express } from 'express-serve-static-core'
import db from '@addressbook/utils/db'
import { createServer } from '@addressbook/utils/server'
import morganBody from 'morgan-body'

let server: Express
beforeAll(async () => {
    await db.open()
    server = await createServer()
})

afterAll(async () => {
    await db.close()
})

/*beforeEach(async () => {
    jest.setTimeout(20000)
})*/

describe('POST /api/v1/user', () => {
    it('1. should return 201 & valid response for valid user', async () => {
        const userData = {
            email: randEmail(),
            password: randPassword(),
        }

        const res = await request(server)
            .post(`/api/v1/user`)
            .send(userData)
            .expect(200)
        expect(res.body).toMatchObject({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            token: expect.stringMatching(
                /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
            ),
            expireAt: expect.any(String), //expireAt: expect.any(Date),
        })
    })

    it('2. should return 409 & valid response for duplicated user', async () => {
        const data = {
            email: randEmail(),
            password: randPassword(),
        }

        await request(server).post(`/api/v1/user`).send(data)
        expect(200)

        const res = await request(server)
            .post(`/api/v1/user`)
            .send(data)
            .expect(409)
        expect(res.body).toMatchObject({
            error: {
                type: 'account_already_exists',
                message: expect.stringMatching(/already exists/),
            },
        })
    })

    it('3. should return 400 & valid response for invalid request', async () => {
        const data = {
            email: null,
            password: randPassword(),
        }

        const res = await request(server)
            .post(`/api/v1/user`)
            .send(data)
            .expect(400)
        expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                code: 'invalid_type',
                expected: 'string',
                message: 'Expected string, received null',
                path: [ 'body', 'email']
            }]
        })
    })
})

describe('POST /api/v1/login', () => {


    /*it('4. should return 200 & valid response for a valid login request', async () => {
        const dummy = await createDummy()

        const res = await request(server)
            .post(`/api/v1/login`)
            .send({
                email: dummy.email,
                password: dummy.password,
            })
            .expect(200)
        //expect(res.header['x-expires-after']).toMatch(/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/)
        expect(res.body).toEqual({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
            expireAt: expect.any(String),
        })
    })*/

    it('5. should return 404 & valid response for a non-existing user', async () => {
        const res = await request(server)
            .post(`/api/v1/login`)
            .send({
                email: randEmail(),
                password: randPassword(),
            })
            .expect(404)
        expect(res.body).toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'Invalid Login/Password',
            },
        })
    })

    it('6. should return 400 & valid response for invalid request', async () => {
    const res = await request(server)
      .post(`/api/v1/login`)
      .send({
        email: 123465,
        password: randPassword()
      })
      .expect(400)
      expect(res.body).toMatchObject({
        status: 'fail',
        error: [{
            code: 'invalid_type',
            expected: 'string',
            received: 'number',
            message: 'Expected string, received number',
            path: [ 'body', 'email']

        }]
          //error: {
          //  type: 'request_validation', 
          //  message: expect.stringMatching(/email/)
          //  }
        })
    })
})

/*describe('login failure', () => {
  it('should return 500 & valid response if auth rejects with an error', async () => {
    (userRepository.login as jest.Mock).mockResolvedValue({error: {type: 'unknown'}})
    const res = await request(server)
      .post(`/api/v1/login`)
      .send({
        email: randEmail(),
        password: randPassword()
      })
      .expect(500)
      expect(res.body).toMatchObject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  })
})*/
