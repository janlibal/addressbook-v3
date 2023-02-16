import addressRepository from '../addressRepository'
import db from '@addressbook/utils/db'
import { randFirstName, randLastName, randPhoneNumber, randStreetAddress } from '@ngneat/falso'
import { createDummy } from '@addressbook/tests/user'

beforeAll(async () => {
    await db.open()
})

afterAll(async () => {
    await db.close()
})


describe('create', () => {

    it('1. Returns saved contact.', async () => {

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

        const contact = await addressRepository.create(contactData, userData)

        expect(contact).not.toBeNull()
        expect(contact!.firstName).toBe(data.firstName)
        expect(contact!.lastName).toBe(data.lastName)
        expect(contact!.phoneNo).toBe(data.phoneNo)
        expect(contact!.address).toBe(data.address)
        expect(contact!.userId).toBe(data.userId)

        

        /*await expect(addressRepository.create(contactData, userData)).resolves.toEqual({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            firstName: expect.any(String),
            lastName: expect.any(String),
            phoneNo: expect.any(String),
            address: expect.any(String),
        })*/

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

        await expect(addressRepository.create(contactData, userData)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'User does not exist',
            },
        })
    })


    it('3. Returns firstname cannot be null.', async () => {

        const dummyUser = await createDummy()

        const input = {
            firstName: null,
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: dummyUser._id,
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
        const contact = await addressRepository.create(contactData, userData)

        expect(contact).not.toBeNull()
        expect(contact!.firstName).toBeNull()
        expect(contact!.lastName).toBe(input.lastName)
        expect(contact!.phoneNo).toBe(input.phoneNo)
        expect(contact!.address).toBe(input.address)
        expect(contact!.userId).toBe(input.userId)

        /*await expect(addressRepository.create(contactData, userData)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'User does not exist',
            },
        })*/
    })

    it('4. Returns lastname cannot be null.', async () => {

        const dummyUser = await createDummy()

        const input = {
            firstName: randFirstName(),
            lastName: null,
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: dummyUser._id,
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
        const contact = await addressRepository.create(contactData, userData)

        expect(contact).not.toBeNull()
        expect(contact!.firstName).toBe(input.firstName)
        expect(contact!.lastName).toBeNull()
        expect(contact!.phoneNo).toBe(input.phoneNo)
        expect(contact!.address).toBe(input.address)
        expect(contact!.userId).toBe(input.userId)

        /*await expect(addressRepository.create(contactData, userData)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'User does not exist',
            },
        })*/
    })

    it('5. Returns phone number cannot be null.', async () => {

        const dummyUser = await createDummy()

        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: null,
            address: randStreetAddress(),
            userId: dummyUser._id,
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
        const contact = await addressRepository.create(contactData, userData)

        expect(contact).not.toBeNull()
        expect(contact!.firstName).toBe(input.firstName)
        expect(contact!.lastName).toBe(input.lastName)
        expect(contact!.phoneNo).toBeNull()
        expect(contact!.address).toBe(input.address)
        expect(contact!.userId).toBe(input.userId)

        /*await expect(addressRepository.create(contactData, userData)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'User does not exist',
            },
        })*/
    })

    it('6. Returns address cannot be null.', async () => {

        const dummyUser = await createDummy()

        const input = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: null,
            userId: dummyUser._id,
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
        const contact = await addressRepository.create(contactData, userData)

        expect(contact).not.toBeNull()
        expect(contact!.firstName).toBe(input.firstName)
        expect(contact!.lastName).toBe(input.lastName)
        expect(contact!.phoneNo).toBe(input.phoneNo)
        expect(contact!.address).toBeNull()
        expect(contact!.userId).toBe(input.userId)

        /*await expect(addressRepository.create(contactData, userData)).resolves.toEqual({
            error: {
                type: 'invalid_credentials',
                message: 'User does not exist',
            },
        })*/
    })

})


describe('getMyContacts', () => {
    it('1. Retrieves data of logged user.', async () => {

        const dummyUser = await createDummy()

        const data = {
            firstName: randFirstName(),
            lastName: randLastName(),
            phoneNo: randPhoneNumber(),
            address: randStreetAddress(),
            userId: dummyUser._id,
        }
        
        const userData = {
            userId: dummyUser._id
        }

        

        const contacts = await addressRepository.getMyContacts(userData)

        expect(contacts).not.toBeNull()

        /*expect(user!.email).toBe(credentials.email)
        expect(user!.password).not.toBe(credentials.password)*/

        /*await expect(addressRepository.getMyContacts(userData)).resolves.toEqual({
            userId: expect.stringMatching(/^[a-f0-9]{24}$/),
            firstName: expect.any(String),
            lastName: expect.any(String),
            phoneNo: expect.any(String),
            address: expect.any(String)
        })*/

    })    
})