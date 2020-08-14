const Telegraf = require('telegraf');

const run = (models) => {
  const { Deal } = models;
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.on('text', async (ctx) => {
    // console.log(ctx);
    const {
      message: {
        text,
        from: { username, id: userid }
      }
    } = ctx;

    let replyText = '';

    // console.log(ctx.message.from);

    if (text[0] == '1') {
      const deal = await Deal.create({ text, username, userid });
      replyText = `Новое дело: ${deal.text.slice(1)}`;
    } else {
      replyText = `${ctx.from.first_name}, ты сказал: "${ctx.message.text}"`;
    }

    ctx.reply(replyText);
  });

  bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  });

  bot.launch();
};

module.exports = {
  run
};
