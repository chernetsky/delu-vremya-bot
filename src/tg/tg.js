const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

const dealCreate = require('./deal/create');
const listView = require('./list/view');

const run = async ({ Deal, List }) => {
  console.log(`run() - ${Date.now()}`);

  // const list1 = await List.create({ name: 'Дела 1' });
  // const list2 = await List.create({ name: 'Дела 2' });
  // const deal1 = await Deal.create({
  //   text: 'Привет, Мир!',
  //   name: 'Дела',
  //   userId: 12345,
  //   username: 'Sergey',
  //   listId: list1.id
  // });
  // deal1.setList(list2)

  const bot = new Telegraf(process.env.BOT_TOKEN);

  const { enter, leave } = Stage;

  const stage = new Stage([listView, dealCreate], { default: 'list-view' });

  bot.use(session());
  bot.use(stage.middleware());

  bot.command('list', enter('list-view'));
  bot.on('message', enter('deal-create'));

  dealCreate.leave(async (ctx) => {
    const { deal: descriptor } = ctx.state;
    if (descriptor) {
      await Deal.create(descriptor);
    }
    ctx.scene.enter('list-view')
  });

  bot.launch();
};

module.exports = run;
