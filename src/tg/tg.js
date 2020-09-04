const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

const dealCreate = require('./deal/create');
const listView = require('./list/view');

const run = async () => {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  const { enter /* , leave */ } = Stage;

  const stage = new Stage([listView, dealCreate], { default: 'list-view' });

  bot.use(session());
  bot.use(stage.middleware());
  setupBasic(bot);

  bot.command('show', enter('list-view'));

  bot.on('message', enter('deal-create'));

  dealCreate.leave(async (ctx) => {
    if (ctx.scene.state.skipLeave) {
      ctx.scene.state.skipLeave = false;
    } else {
      ctx.scene.state.skipLeave = true;
      return ctx.scene.enter('list-view');
    }
  });

  bot.launch();
};

const setupBasic = (bot) => {
  bot.telegram.setMyCommands([
    {
      command: 'start',
      description: 'Начни отсюда!'
    },
    {
      command: 'show',
      description: 'Показать основной список дел.'
    }
  ]);

  bot.start((ctx) => {
    ctx.scene.enter('list-view');
  });

  bot.help((ctx) => {
    return ctx.reply('Скоро здесь появится справка...');
  });
};

module.exports = run;
