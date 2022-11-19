import addressRepository from '../addressRepository'
import userRepository from '../userRepository'
import db from '@addressbook/utils/db'
import { randFirstName, randLastName, randPhoneNumber, randStreetAddress } from '@ngneat/falso'
import { createDummy } from '@addressbook/tests/user'

beforeAll(async () => {
    await db.open()
})

afterAll(async () => {
    await db.close()
})


describe('Save Contact', () => {
    it('1. Returns the data to be saved plus Id of logged user.', async () => {

        const dummyUser = await createDummy()

        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: dummyUser.userId,
        }

        const getUserEmail = await userRepository.getUserEmail(input)

        const fullName = input.lastName + ', ' + input.firstName
        
        const contactData = {
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNo: input.phoneNo,
            address: input.address,
        }

        const userData = {
            email: getUserEmail,
            fullName: fullName,
            userId: input.userId
        }

        await expect(addressRepository.saveContact(contactData, userData)).resolves.toEqual({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            email: {
                email: expect.stringMatching(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i),
            },
            firstName: expect.any(String),
            lastName: expect.any(String),
            phoneNo: expect.any(String),
            address: expect.any(String),
        })

    })

    it('2. Returns user does not exist.', async () => {
        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: null,
        }

        const userEmail = userRepository.getUserEmail(input)

        const fullName = input.lastName + ', ' + input.firstName

        const contactData = {
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNo: input.phoneNo,
            address: input.address,
        }

        const userData = {
            userEmail: userEmail,
            fullName: fullName,
            userId: input.userId,
        }

        await expect(
            addressRepository.saveContact(contactData, userData)
        ).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'User does not exist',
            },
            //error: {type: 'internal_server_error', message: 'Internal Server Error'}
        })
    })
})

describe('Get User Email', () => {
    it('1. Returns valid email of existing user incl. Id.', async () => {

        const dummyUser = await createDummy()

        const userData = {
            userId: dummyUser.userId
        }

        await expect(userRepository.getUserEmail(userData)).resolves.toEqual(
            {
                /*user: {
                    email: expect.stringMatching(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i),
                },*/
                email: expect.any(String)
            }
        )
    })

    it('2. Returns error for invalid user.', async () => {
        const userData = {
            userId: null,
        }

        await expect(userRepository.getUserEmail(userData)).resolves.toEqual(
            {
                error: {
                    type: 'invalid_credentials',
                    message: 'User does not exist',
                },
            }
        )
    })
})
