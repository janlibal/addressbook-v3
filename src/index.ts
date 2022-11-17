import { createServer } from './utils/server'
import logger from '@addressbook/utils/logger'
import config from '@addressbook/config'

createServer()
  .then(server => {
    server.listen(config.port, () => {
      logger.info(`Listening on http://localhost:${config.port}`)
    })
  })
  .catch(err => {
    logger.error(`Error: ${err}`)
  })