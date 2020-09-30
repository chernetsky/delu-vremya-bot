const { Sequelize } = require('sequelize');
const initDeal = require('./Deal');
const initList = require('./List');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, IS_DEV } = process.env;
const IS_DEV_BOOL = !!Number(IS_DEV);

// if (IS_DEV_BOOL) {
  console.log(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, IS_DEV_BOOL);
// }

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',

  logging: false
});

const testConnection = async (syncOptions = null) => {
  return new Promise((resolve, reject) => {
    sequelize
      .authenticate()
      .then(() => {
        if (IS_DEV_BOOL) {
          console.log('DB ... Connected');
        }
        if (syncOptions) {
          return sequelize.sync(syncOptions).then(() => {
            if (IS_DEV_BOOL) {
              console.log('DB ... Syncronized');
            }
            resolve();
          });
        } else {
          resolve();
        }
      })
      .catch((error) => {
        if (IS_DEV_BOOL) {
          console.error('DB ... Connection error!');
        }
        reject(error);
      });
  });
};

// Init models
const Deal = initDeal(sequelize);
const List = initList(sequelize);

// Setup models associations
List.hasMany(Deal, {
  foreignKey: 'listId'
});
Deal.belongsTo(List, {
  foreignKey: 'listId'
});

module.exports = {
  sequelize,
  testDbConnection: testConnection,

  models: {
    Deal,
    List
  }
};
