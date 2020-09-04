const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const List = sequelize.define(
    'List',
    {
      name: {
        type: DataTypes.STRING(1000),
        allowNull: false
      },
      userId: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      current: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: 'lists',
      indexes: [
        {
          fields: ['userId']
        }
      ]
    }
  );

  return List;
};
