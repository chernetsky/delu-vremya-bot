const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

const dealCreateWizard = require('./deal/create');
const listView = require('./list/view');

const run = async ({ Deal, List }) => {
  console.log(`run() - ${Date.now()}`);

  const list1 = await List.create({ name: 'Дела 1' });
  const list2 = await List.create({ name: 'Дела 2' });
  const deal1 = await Deal.create({ 
    text: 'Привет, Мир!', 
    name: 'Дела',
    userId: 12345,
    username: 'Sergey',
    listId: list1.id
  });
  deal1.setList(list2)

  const bot = new Telegraf(process.env.BOT_TOKEN);

  const stage = new Stage([listView, dealCreateWizard] /* { default: 'list-view' } */);
  bot.use(session());
  bot.use(stage.middleware());

  bot.command('show', (ctx) => ctx.scene.enter('list-view'));
  // bot.command('echo', (ctx) => ctx.scene.enter('echo'))
  bot.on('message', (ctx) => {
    //ctx.reply('Try /echo or /greeter')
    ctx.scene.enter('deal-create-wizard');
  });

  bot.launch();
};

module.exports = run;
