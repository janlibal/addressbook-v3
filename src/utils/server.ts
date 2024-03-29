import express, {Request, Response, NextFunction} from 'express'
import { Express } from 'express-serve-static-core'
import routes from '@addressbook/api/index'

import { connector, summarise } from 'swagger-routes-express'
import YAML from 'yamljs'
import logger from '@addressbook/utils/logger'

import bodyParser from 'body-parser'

import morgan from 'morgan'
import morganBody from 'morgan-body'

import config from '@addressbook/config'
import {expressDevLogger} from '@addressbook/utils/express_dev_logger'

import V1SwaggerDocs from '@addressbook/api/v1/routes/swagger'


export async function createServer(): Promise<Express> {
  
  const yamlSpecFile = './config/v1/openapi.yml'
  const apiDefinition = YAML.load(yamlSpecFile)
  const apiSummary = summarise(apiDefinition)
  logger.info(apiSummary)

  const server = express()
  server.use(bodyParser.json())
  
  if (config.morganLogger) {
    server.use(morgan(':method :url :status :response-time ms - :res[content-length]'))
  }
  
  if (config.morganBodyLogger) {
    morganBody(server)
  }

  if (config.addressBookDevLogger) {
    server.use(expressDevLogger)
  }

  V1SwaggerDocs(server, config.port)
  
  routes(server)
  
  return server
}


