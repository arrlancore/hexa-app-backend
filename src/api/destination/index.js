'use strict'

import controllers from './controllers'
import config from '../../config/auth'

const moduleName = 'destination'

export default (app) => {
  app.get(`/${moduleName}`, config.authenticate, controllers.list)
    .post(`/${moduleName}`, config.authenticate, controllers.add)
  app.get(`/${moduleName}/:id`, config.authenticate, controllers.read)
    .put(`/${moduleName}/:id`, config.authenticate, controllers.edit)
    .delete(`/${moduleName}/:id`, config.authenticate, controllers.remove)
  app.get(`/${moduleName}-type`, config.authenticate, controllers.typeDestinationList)
  app.get(`/${moduleName}-cluster/:clusterId`, config.authenticate, controllers.getDestinationCluster)
    .put(`/${moduleName}-cluster`, config.authenticate, controllers.updateDestinationCluster)
  return app
}
