/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const birdhouses = require('../data/birdhouses.js');
const residencies = require('../data/residencies.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    for (const birdhouse of birdhouses) {
      const residency = residencies.find(
        (residency) => residency.birdhouseId === birdhouse.id,
      );
      await queryInterface.bulkUpdate(
        'birdhouses',
        { residencyId: residency.id },
        { id: birdhouse.id },
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'birdhouses',
      { residencyId: null },
      { residencyId: { [Sequelize.Op.ne]: null } },
    );
  },
};
