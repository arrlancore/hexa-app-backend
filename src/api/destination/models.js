'use strict'

import mongoose, { Schema } from 'mongoose'

export const TYPE_DESTINATIONS = ['Nature', 'Historical', 'Market', 'Art and Culture']

const DestinationBorderSchema = new Schema({
  destinationName: {
    type: String,
    max: 255,
    trim: true,
    required: [true, 'Nearest destination name is required']
  },
  nearestKey: {
    type: Number,
    required: [true, 'Nearest key is required']
  },
  border: {
    type: Number,
    required: [true, 'Border number is required']
  },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }
})

const DestinationBorder = mongoose.model('DestinationBorder', DestinationBorderSchema)

const DestinationSchema = new Schema({
  destinationName: {
    type: String,
    max: 255,
    trim: true,
    required: [true, 'Destination name is required']
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    default: TYPE_DESTINATIONS[0],
    required: [true, 'Destination type is required'],
    enum: TYPE_DESTINATIONS
  },
  isRoot: {
    type: Boolean,
    default: false
  },
  estimatedDailyCost: {
    type: Number,
    default: 0
  },
  ticketPrice: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  position: {
    type: Object,
    required: [true, 'Position is required']
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cluster: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster' },
  nearest: [DestinationBorderSchema]
})


export default mongoose.model('Destination', DestinationSchema)
