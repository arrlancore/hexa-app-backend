'use strict'

import controllers from './controllers'
import config from '../../config/auth'

const moduleName = 'cluster'

export default (app) => {
  app.get(`/${moduleName}`, config.authenticate, controllers.list)
    .post(`/${moduleName}`, config.authenticate, controllers.add)
  app.get(`/${moduleName}/:id`, config.authenticate, controllers.read)
    .put(`/${moduleName}/:id`, config.authenticate, controllers.edit)
    .delete(`/${moduleName}/:id`, config.authenticate, controllers.remove)
  return app
}
