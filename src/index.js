const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;

  console.log("Response time: %sms", ms);
});

bot.on("text", (ctx) => {
  console.log(ctx)
  ctx.reply(`Hi, ${ctx.from.first_name}. You said: "${ctx.message.text}"`);
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
});

bot.launch();
