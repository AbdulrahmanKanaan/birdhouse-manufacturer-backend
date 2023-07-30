'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('birdhouses', 'residencyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'residencies',
        key: 'id',
      },
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('birdhouses', 'residencyId');
  },
};
