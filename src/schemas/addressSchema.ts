import { object, string, TypeOf } from 'zod'

export const createAddressSchema = object({
    body: object({
        firstName: string({
            required_error: 'First Name is required!',
        }),
        lastName: string({
            required_error: 'Last Name is required!',
        }),
        phoneNo: string({
            required_error: 'Phone Number is required',
        }),
        address: string({
            required_error: 'Address is required',
        }),
    }),
})

export type CreateAddressInput = TypeOf<typeof createAddressSchema>['body']
