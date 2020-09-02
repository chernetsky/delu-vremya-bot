const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const List = sequelize.define(
    'List',
    {
      name: {
        type: DataTypes.STRING(1000),
        allowNull: false
      }
    },
    {
      tableName: 'lists'
    }
  );

  return List;
};
