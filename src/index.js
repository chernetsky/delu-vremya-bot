const Telegraf = require("telegraf");
const { testConnection, Deal } = require("./db");

// testConnection({ alter: true, force: true });

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;

  console.log("Response time: %sms", ms);
});

bot.on("text", async (ctx) => {
  console.log(ctx);
  const { message } = ctx;
  const { text } = message;
  let replyText = '';

  // if (text == "1") {
    const deal = await Deal.create({ text });
    // Jane exists in the database now!
    console.log(deal instanceof Deal); // true
    console.log(deal.text); // "Jane"

    replyText = `Новое дело: ${deal.text}`
  // } else {
  //   replyText = `${ctx.from.first_name}, ты сказал: "${ctx.message.text}"`;
  // }

  ctx.reply(replyText);
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.launch();
