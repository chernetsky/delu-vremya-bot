const { testDbConnection } = require('./db/db');
const run = require('./tg/tg');

const { DB_INIT } = process.env;

const syncOpts = Number(DB_INIT) ? { force: true } : void 0;

testDbConnection(syncOpts)
  .then(() => run())
  .catch((error) => {
    console.error(error);
    console.error('EXIT WITH 1');
    process.exit(1);
  });
