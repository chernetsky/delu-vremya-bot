const { testDbConnection, models } = require('./db/db');
const { run } = require('./tg/tg');

testDbConnection(/* { alter: true, force: true } */)
  .then(() => run(models))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
