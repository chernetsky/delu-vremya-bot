const { DataTypes } = require('sequelize');
const { WHEN } = require('../constants');

module.exports = (sequelize) => {
  const Deal = sequelize.define(
    'Deal',
    {
      text: {
        type: DataTypes.STRING(1000)
      },
      done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      periodic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      when: {
        type: DataTypes.STRING,
        defaultValue: WHEN.EVERYDAY
      },
      deadline: {
        type: DataTypes.DATE
      },
      userId: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      listId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      tableName: 'deals',
      indexes: [
        {
          fields: ['userId']
        },
        {
          fields: ['listId']
        },
      ]
    }
  );

  return Deal;
};
