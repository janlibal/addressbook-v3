import userRoutes from '@addressbook/routes/v1/userRoutes'
import addressRoutes from '@addressbook/routes/v1/addressRoutes'

export default function (server: any) {
    server.use('/api/v1', userRoutes)
    server.use('/api/v1', addressRoutes)
}
