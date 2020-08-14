const { Sequelize } = require('sequelize');
const initDeal = require('./Deal');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres'
});

const testConnection = async (syncOptions = null) => {
  return new Promise((resolve, reject) => {
    sequelize
      .authenticate()
      .then(() => {
        console.log('DB ... Connected');
        if (syncOptions) {
          return sequelize.sync(syncOptions).then(() => {
            console.log('DB ... Syncronized');
            resolve();
          });
        } else {
          resolve();
        }
      })
      .catch((error) => {
        console.error('DB ... Connection error!');
        reject(error);
      });
  });
};

// Init models
const Deal = initDeal(sequelize);

module.exports = {
  sequelize,
  testDbConnection: testConnection,

  models: {
    Deal
  }
};
