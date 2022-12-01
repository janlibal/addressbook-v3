import { randLastName, randFirstName, randPhoneNumber, randStreetAddress } from '@ngneat/falso'
import request from 'supertest'
import { Express } from 'express-serve-static-core'

import db from '@addressbook/utils/db'
import { createServer } from '@addressbook/utils/server'
import { authorizeUser, createDummy, createDummyAndAuthorize } from '@addressbook/tests/user'
import userRepository from '@addressbook/api/repositories/userRepository'
import { Response } from 'swagger-jsdoc'

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

// change hard coded userId with a dummy and authorized userId
const testUserId = '6381d73a6f7c314304503426'
const testToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzgxZDczYTZmN2MzMTQzMDQ1MDM0MjYiLCJpYXQiOjE2Njk3MTIzNDEsImV4cCI6MTY3MDkyMTk0MX0.OTVYwFL5gcuCxZzETDP_HbnuBvlg0mlgZh1qcNaNEqI283R1ovhEVhCzudDkoapNjHgFEag_cMoakTTQBVaiXUlbdrObG_slh_-OxjU59imPfIdI0aLfaGxvTO5Mawlg98DO2b2prUe27RQe74fzNcdN_O54-soXDWl9j7OtX8QzGF_3Mx-ZlhzV3W1utFOPm7HGLDHQ_ZPAGR_7JNrMKiL4grcuN-40wnDb2zVBb6yQR8SLirTW8nmcJGPa-lifxfP3-dSQNc76QxoV3I2-Ij_G3paI9CCrAXYrqMqCZbPDr0_fg8egUad-olwt8EmrwaCy2DtByGV26noep9rr0Q'

describe('POST /contact', () => {
    /*it('1. should return 200 & valid response if request param list is correct', async () => {
        //const userToken = await authorizeUser(testUserId)

        const user = await createDummyAndAuthorize()
        
        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: user.userId 
        }

        const res = await request(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(200)
                    
            expect(res.body).toMatchObject({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            firstName: expect.any(String),
            lastName: expect.any(String),
            phoneNo: expect.any(String),
            address: expect.any(String),
        })
       
    })*/

    it('2. should return 401 if authorization is missing', async () => {
        const userToken = null
        
        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
        }

        const res = await request(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(401)

        expect(res.body).toMatchObject({
            error: {
                type: 'unauthorized',
                message: 'Authentication Failed',
            },
        })
    })

    it('3. should return 400 if firstname is incorrect', async () => {
        const user = await createDummyAndAuthorize()
        //const userToken =  await authorizeUser(testUserId)

                
        const input = {
            firstName: 123456,
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: user.userId 
        }

        const res = await request(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400)
            expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                code: 'invalid_type',
                expected: 'string',
                received: 'number',
                message: 'Expected string, received number',
                path: [ 'body', 'firstName']
    
            }]
        })
    })

    it('3. should return 400 if lastname is incorrect', async () => {
        const user = await createDummyAndAuthorize()
        //const userToken =  await authorizeUser(testUserId)

        const input = {
            firstName: randFirstName(),
            lastName: 1234657,
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: user.userId
        }

        const res = await request(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400)
            expect(res.body).toMatchObject({
            status: 'fail',
            error: [{
                code: 'invalid_type',
                expected: 'string',
                received: 'number',
                message: 'Expected string, received number',
                path: [ 'body', 'lastName']
    
            }]
        })


    })

    it('4. should return 400 if phone number is incorrect', async () => {
        const user = await createDummyAndAuthorize()
        //const userToken =  await authorizeUser(testUserId)

        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: 1212545,
            address: randStreetAddress(),
            userId: user.userId
        }

        const res = await request(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400)
            expect(res.body).toMatchObject({
                status: 'fail',
                error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    message: 'Expected string, received number',
                    path: [ 'body', 'phoneNo']
                }]
            })
    })

    it('5. should return 400 if address is incorrect', async () => {
        const user = await createDummyAndAuthorize()
        //const userToken =  await authorizeUser(testUserId)

        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: 4567890,
            userId: user.userId
        }

        const res = await request(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400)
            expect(res.body).toMatchObject({
                status: 'fail',
                error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    message: 'Expected string, received number',
                    path: [ 'body', 'address']
                }]
            })
    })

    it('6. should return 400 if firstname is missing', async () => {
        const user = await createDummyAndAuthorize()
        //const userToken =  await authorizeUser(testUserId)

        const input = {
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: user.userId
        }

        const res = await request(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400)
            expect(res.body).toMatchObject({
                status: 'fail',
                error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                    message: 'First Name is required!',
                    path: [ 'body', 'firstName']
                }]
            })
    })

    it('7. should return 400 if lastname is missing', async () => {
        const user = await createDummyAndAuthorize()
        //const userToken =  await authorizeUser(testUserId)

        const input = {
            firstName: randFirstName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: user.userId
        }

        const res = await request(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400)
            expect(res.body).toMatchObject({
                status: 'fail',
                error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                    message: 'Last Name is required!',
                    path: [ 'body', 'lastName']
                }]
            })
    })

    it('8. should return 400 if phone number is missing', async () => {
        const user = await createDummyAndAuthorize()
        //const userToken =  await authorizeUser(testUserId)

        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            address: randStreetAddress(),
            userId: user.userId
        }

        const res = await request(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400)

            expect(res.body).toMatchObject({
                status: 'fail',
                error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                    message: 'Phone Number is required',
                    path: [ 'body', 'phoneNo']
                }]
            })
    })

    it('9. should return 400 if address is missing', async () => {
        const user = await createDummyAndAuthorize()
        //const userToken =  await authorizeUser(testUserId)

        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            userId: user.userId
        }

        const res = await request(server)
            .post(`/api/v1/contact`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400)
            expect(res.body).toMatchObject({
                status: 'fail',
                error: [{
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                    message: 'Address is required',
                    path: [ 'body', 'address']
                }]
            })
    })
})
