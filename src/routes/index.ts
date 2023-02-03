import userRoutes from '@addressbook/routes/v1/userRoutes'
import addressRoutes from '@addressbook/routes/v1/addressRoutes'
import testRoutes from '@addressbook/routes/v1/testRoutes'

export default function (server: any) {

    server.use('/api/v1', userRoutes)
    server.use('/api/v1', testRoutes)
    server.use('/api/v1', addressRoutes)
    
}
