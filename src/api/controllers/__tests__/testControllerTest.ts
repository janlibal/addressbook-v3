import request from 'supertest'
import {Express} from 'express-serve-static-core'

import {createServer} from '@addressbook/utils/server'

let server: Express

beforeAll(async () => {
  server = await createServer()
})

describe('GET /test', () => {
  it('should return 200 & valid response if request param list is empity', async () => {
    const res = await request(server)
      .get(`/api/v1/test`)
      .expect('Content-Type', /json/)
      .expect(200)
       expect(res.body).toMatchObject({'message': 'Hello, stranger!'})
  
  })
})