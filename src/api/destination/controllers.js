'use strict'

import service from './services'
import {TYPE_DESTINATIONS} from './models'

const moduleName = 'destination'
module.exports = {
  add,
  edit,
  read,
  list,
  remove,
  typeDestinationList,
  getDestinationCluster,
  updateDestinationCluster
}

async function add (req, res) {
  try {
    const data = req.body
    if (req.user) {
      data.createdBy = req.user._id
    }
    const response = await service.create(data)
    res.send({ data: response, message: 'new ' + moduleName + ' has been successfully created' })
  } catch (error) {
    res.status(400).send(res.setError(error))
  }
}

async function edit (req, res) {
  try {
    const data = req.body
    const { id } = req.params
    if (req.user) {
      data.updatedBy = req.user._id
    }
    const response = await service.update(id, data)
    res.send({ status: response.ok, message: moduleName + ' has been successfully updated' })
  } catch (error) {
    res.status(400).send(res.setError(error))
  }
}

async function remove (req, res) {
  try {
    const { id } = req.params
    const data = await service.remove(id)
    res.send({ message: moduleName + ' has been successfully removed', status: data.ok })
  } catch (error) {
    res.status(400).send(res.setError(error))
  }
}

async function read (req, res) {
  try {
    const { id } = req.params
    const viewData = await service.read(id)
    if (viewData) return res.send(viewData)
    res.status(404).send({ message: 'Data not found' })
  } catch (error) {
    res.status(400).send(res.setError(error))
  }
}

async function list (req, res) {
  try {
    const [data, count] = await service.list(req.query)
    res.send({ data, count })
  } catch (error) {
    res.status(400).send(res.setError(error))
  }
}

function typeDestinationList (req, res) {
  res.send(TYPE_DESTINATIONS)
}

async function getDestinationCluster (req, res) {
  try {
    const { clusterId } = req.params
    const viewData = await service.listByCluster(clusterId)
    const jsonResult = JSON.stringify(viewData)
    if (viewData) return res.send(await service.fromListToClusterNode(JSON.parse(jsonResult), clusterId))
    res.status(404).send({ message: 'Data not found' })
  } catch (error) {
    res.status(400).send(res.setError(error))
  }
}

async function updateDestinationCluster (req, res) {
  try {
    const list = service.fromClusterNodeToList(req.body)
    const updates = []

    for (let i=0; i< list.length; i++) {
      const data = list[i]
      const result = await service.update(data._id, data)
      updates.push(result)
    }
    if (updates[0]) return res.send({updates, message: moduleName + ' in cluster has been successfully updated' })
    res.status(404).send({ message: 'No data to update' })
  } catch (error) {
    res.status(400).send(res.setError(error))
  }
}
