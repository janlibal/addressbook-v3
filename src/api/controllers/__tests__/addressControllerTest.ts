import { randLastName, randFirstName, randPhoneNumber, randStreetAddress } from '@ngneat/falso'
import request from 'supertest'
import { Express } from 'express-serve-static-core'
import db from '@addressbook/utils/db'
import { createServer } from '@addressbook/utils/server'
import {  createDummyAndAuthorize } from '@addressbook/tests/user'

let server: Express
beforeAll(async () => {
    await db.open()
    server = await createServer()
})

afterAll(async () => {
    await db.close()
})


describe('POST /contact', () => {
    it('1. should return 200 & valid response if request param list is correct', async () => {
        
        const user = await createDummyAndAuthorize()
        
        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: user._id 
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
       
    })

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
                        
        const input = {
            firstName: 123456,
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: user._id 
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
        
        const input = {
            firstName: randFirstName(),
            lastName: 1234657,
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: user._id
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
        
        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: 1212545,
            address: randStreetAddress(),
            userId: user._id
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
        
        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: 4567890,
            userId: user._id
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
        
        const input = {
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: user._id
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
        
        const input = {
            firstName: randFirstName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: user._id
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
        
        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            address: randStreetAddress(),
            userId: user._id
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
        
        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            userId: user._id
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
