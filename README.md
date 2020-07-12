# Hex the budget app (backend)

## Technology stack

- NodeJs
- ExpressJs
- MongoDB & Mongoose

## Requirements System
- [Node.js]("https://nodejs.org/") >= 8.x
- [MongoDB]("https://docs.mongodb.com/manual/installation/")

## Getting Started
git clone https://github.com/arrlancore/hexa-app-backend.git
cd hexa-app-backend
npm install
npm run dev (Development)
npm run build && npm run start:prod (Production)

The build result will be on `/dist` directory

## API Documentation

The swagger documentation will be running on `/api/docs`

## Style Guide

All of the API services will be placed on `/src/api` directory

## Structure Data

The main problem is to use this backend service to store data graph.

We can manage multiple cluster, on the database we stored it on the `clusters` collection.

Nodes in the cluster is stored on `destinations` collections

Basically we just use backend service to store the graph data, while operation add, delete & query is done by frontend app.

At backend we use API `/api/destination-cluster/:id` [GET] to get all nodes on a cluster & `/api/destination-cluster/:id` [PUT] to create or update data nodes on a cluster for master data.

For transactional, we will use `/api/trip-plan` to stored user data.

