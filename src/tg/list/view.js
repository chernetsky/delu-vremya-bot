const r = require('ramda');
const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const {
  models: { Deal, List }
} = require('../../db/db');
const { getCurrentList } = require('../../helpers/helpers');

// List view scene
const listViewScene = new Scene('list-view');

const makeDealLabel = (deal) => deal.text + (deal.done ? '  ✅' : '   ');

const makeKeyboard = r.compose(
  Markup.inlineKeyboard,
  r.splitEvery(1),
  r.map((item) => Markup.callbackButton(item.text, item.data)),
  r.map(
    r.applySpec({
      text: makeDealLabel,
      data: (item) => `${item.done ? '!' : ''}deal_${item.id}`
    })
  )
);

listViewScene.enter(async (ctx) => {
  const list = await getCurrentList(ctx.from.id);
  const listId = ctx.scene.state.listId = list.id;

  const deals = await Deal.findAll({
    where: {
      listId
    }
  });

  return ctx.reply(list.name, makeKeyboard(deals).extra());
});

listViewScene.action(/^!?deal_\d+/, async (ctx) => {
  const { data } = ctx.callbackQuery;
  console.log(data);
  let done = data.indexOf('!') == 0;
  const id = data.replace(/^!?deal_/, '');
  if (id) {
    done = !done;
    await Deal.update({ done }, { where: { id } });
  }

  const deals = await Deal.findAll({
    where: {
      listId: ctx.scene.state.listId
    }
  });

  ctx.editMessageReplyMarkup(makeKeyboard(deals));
});

module.exports = listViewScene;
