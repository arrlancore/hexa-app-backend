'use strict'

import aclStore from '../helper/acl-store'
import config from './config'
import { Router } from 'express'
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const fs = require('fs')
const path = require('path')
const API = '/api'

const sourceApi = path.resolve('./src/api')

export default (app) => {
  const { acl } = aclStore

  /**
   * Public
   */
  app.get(API, async (req, res) => {
    await setTimeout(async () => {
      res.json({ version: "1.1" })
    }, 100)
  })

  let modules = fs.readdirSync(sourceApi)
  let pathModule = []
  for (let i = 0; i < modules.length; i++) {
    let directoryName = modules[i]
    const module = require(path.resolve('./src/api/' + directoryName))
    pathModule = [...pathModule, './src/api/' + directoryName + '/index.js']
    app.use(API, module.default(Router()))
  }
  const options = {
    definition: {
      openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
      info: {
        title: 'Hexa App', // Title (required)
        version: '1.0.0', // Version (required)
        description: "Documentation of API's",
        contact: {
          email: 'example@gmail.com'
        },
        license: {
          name: 'LICENSE',
          url: 'https://github.com/arrlancore/hexa-app-backend'
        }
      }
    },
    servers: [
      {
        url: `http://localhost:${config.apiPort}/api`,
        description: 'Development server api'
      }
    ],
    apis: pathModule
  }

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  const swaggerSpec = swaggerJSDoc(options)

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  /**
   * Private
   */
  // applies passport authentication on all following routes
  // app.all('*', auth.authenticate(), (req, res, next) => next())

  // Example endpoint only available for 'admin' role
  app.get(`${API}/adminonly`, acl.middleware(), (req, res) =>
    res.sendStatus(200)
  )

  // Example protected endpoint
  app.get(`${API}/protected`, (req, res) => res.sendStatus(200))

  // Will return error message as a string -> "Insufficient permissions to access resource"
  app.use(acl.middleware.errorHandler('json'))
}
