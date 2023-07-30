/* eslint-disable @typescript-eslint/no-var-requires */
const { v4: uuid } = require('uuid');

module.exports = [
  {
    id: uuid(),
    ubid: uuid(),
    name: 'Bluebird House',
    longitude: 12.34,
    latitude: 45.67,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    ubid: uuid(),
    name: 'Wren House',
    longitude: 512.3,
    latitude: 12.45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    ubid: uuid(),
    name: 'Finch House',
    longitude: -122.4167,
    latitude: 37.7833,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
