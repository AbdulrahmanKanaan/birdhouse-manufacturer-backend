/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const residencies = require('../data/residencies.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('residencies', residencies, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('residencies', null, {});
  },
};
