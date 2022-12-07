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

        const data = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: dummyUser._id,
        }

        const fullName = data.lastName + ', ' + data.firstName
        
        const contactData = {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNo: data.phoneNo,
            address: data.address,
        }

        const userData = {
            fullName: fullName,
            userId: data.userId
        }

        await expect(addressRepository.saveContact(contactData, userData)).resolves.toEqual({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
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

        const fullName = input.lastName + ', ' + input.firstName

        const contactData = {
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNo: input.phoneNo,
            address: input.address,
        }

        const userData = {
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
        })
    })
})