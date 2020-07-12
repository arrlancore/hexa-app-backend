'use strict'

import mongoose, { Schema } from 'mongoose'

const ClusterSchema = new Schema({
  name: {
    type: String,
    unique: true,
    max: 32,
    trim: true,
    required: [true, 'Cluster name is required']
  },
  descripion: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})


export default mongoose.model('Cluster', ClusterSchema)
