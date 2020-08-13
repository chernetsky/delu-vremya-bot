const { Sequelize } = require("sequelize");
const initDeal = require("./Deal");

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
});

const testConnection = async (syncOptions = null) => {
  try {
    await sequelize.authenticate();
    console.log("DB ... Connected");
  } catch (error) {
    console.error("DB error:", error);
  }

  if (syncOptions) {
    await sequelize.sync(syncOptions);
    console.log("DB ... Syncronized");
  }
};


// Init models
const Deal = initDeal(sequelize);


module.exports = {
  sequelize,
  testConnection,

  Deal
};
