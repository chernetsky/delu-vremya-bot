const { Op } = require('sequelize');
const moment = require('moment');
const { testDbConnection, models } = require('../db/db');

const run = async () => {
  const { Deal } = models;

  const now = moment.now();

  const where = {
    periodic: true,
    done: true,
    undoneAt: {
      [Op.and]: [{ [Op.not]: null }, { [Op.lte]: now }]
    }
  };

  if (process.env.IS_DEV) {
    const deals = await Deal.findAll({
      attributes: ['id', 'text', 'done', 'cleared', 'undoneAt'],
      where
    });

    deals.map((item) => {
      console.log(item.dataValues);
    });
  }

  await Deal.update({ done: false, cleared: false, undoneAt: null }, { where });

  process.exit(0);
};

testDbConnection()
  .then(() => run())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
