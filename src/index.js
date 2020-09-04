const { testDbConnection } = require('./db/db');
const run = require('./tg/tg');

testDbConnection(/* { force: true } */)
  .then(() => run())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
