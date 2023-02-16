import userRoutes from '@addressbook/api/v1/routes/userRoutes'
import addressRoutes from '@addressbook/api/v1/routes/addressRoutes'
import testRoutes from '@addressbook/api/v1/routes/testRoutes'

export default function (server: any) {

    server.use('/api/v1', userRoutes)
    server.use('/api/v1', testRoutes)
    server.use('/api/v1', addressRoutes)
        
}
