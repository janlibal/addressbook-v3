import { createServer } from './utils/server'
import logger from '@addressbook/utils/logger'
import config from '@addressbook/config'
import db from '@addressbook/utils/db'



db.open()
  .then(() => createServer())
    .then((server) => {
        server.listen(config.port, () => {
            logger.info(`Listening on http://localhost:${config.port}`)
        })
    })
    .catch((err) => {
        logger.error(`Error: ${err}`)
    })