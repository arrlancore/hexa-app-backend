'use strict'

import Destination from './models'
const ObjectId = require('mongoose').Types.ObjectId

export default {
  create,
  update,
  read,
  remove,
  list,
  listByCluster,
  fromListToClusterNode,
  fromClusterNodeToList
}

function create (data) {
  try {
    const newEntry = new Destination(data)
    return newEntry.save()
  } catch (error) {
    throw new Error(error)
  }
}

function read (id) {
  try {
    return Destination.findOne({ _id: new ObjectId(id) })
      .populate('createdBy', 'fullName')
      .populate('cluster')
  } catch (error) {
    throw new Error(error)
  }
}


function list (query) {
  try {
    // filter the list
    let condition = {}
    if (query._id) {
      condition._id = query._id
    }
    if (query.destinationName) {
      condition.title = {
        $regex: new RegExp(query.title)
      }
    }
    if (query.description) {
      condition.content = {
        $regex: new RegExp(query.content)
      }
    }
    // set a custom field selected
    let selected = query.selected || null
    // set options for sorting & pagination
    let options = {
      limit: 25,
      skip: 0,
      sort: '-createdAt'
    }
    if (query.limit) {
      options.limit = Number(query.limit)
    }
    if (query.page) {
      options.skip = (Number(query.page) - 1) * query.limit
    }
    if (query.sort) {
      options.sort = query.sort
    }
    return Promise.all([
      Destination.find(condition, selected, options)
        .populate('createdBy', 'fullName')
        .populate('cluster'),
      Destination.countDocuments(condition)
    ])
  } catch (error) {
    throw new Error(error)
  }
}

function update (id, data) {
  try {
    return Destination.updateOne({ _id: id }, { $set: data })
  } catch (error) {
    throw new Error(error)
  }
}

function remove (id) {
  try {
    return Destination.remove({ _id: id })
  } catch (error) {
    throw new Error(error)
  }
}

function listByCluster (clusterId) {
  try {
    // filter the list
    let condition = { cluster: clusterId}
    return Destination.find(condition)
      .populate('createdBy', 'fullName')
      .populate('cluster')
  } catch (error) {
    throw new Error(error)
  }
}

function fromListToClusterNode (list=[]) {
  const cluster = [...list][0].cluster
  const nodes = list.reduce((acc, data) => {
    const currentData = Object.assign({}, data)
    const borders = data.nearest.reduce((accBorders, nearItem) => {
      accBorders[nearItem.nearestKey] = Object.assign({}, nearItem)
      accBorders[nearItem.nearestKey]['name'] = nearItem.destination
      accBorders[nearItem.nearestKey]['destination'] = undefined
      accBorders[nearItem.nearestKey]['_id'] = undefined
      accBorders[nearItem.nearestKey]['nearestKey'] = undefined
      return accBorders
    }, {})
    currentData.borders = borders
    currentData.nearest = undefined
    currentData.cluster = undefined
    // add to dictionary
    acc[data._id] = currentData
    return acc
  }, {})
  return { cluster, nodes, count: list.length }
}

function fromClusterNodeToList (nodes){
  return Object.values(nodes).map(item => {
    const data = {...item}
    data.nearest = Object.entries(item.borders).map(([key, property]) => {
      const itemNearest = {...property}
      itemNearest['nearestKey'] = Number(key)
      itemNearest['destination'] = property.name
      itemNearest['name'] = undefined
      return itemNearest
    })
    data.borders = undefined
    return data
  })
}