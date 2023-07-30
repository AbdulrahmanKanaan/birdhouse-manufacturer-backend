/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const birdhouses = require('../data/birdhouses.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('birdhouses', birdhouses, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('birdhouses', null, {});
  },
};
