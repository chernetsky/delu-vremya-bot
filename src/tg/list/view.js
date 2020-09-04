const Scene = require('telegraf/scenes/base');
const { models: { Deal, List } } = require('../../db/db');
const { getDefaultList } = require('../../helpers/helpers');


// List view scene
const listViewScene = new Scene('list-view');

listViewScene.enter(async (ctx) => {
  const list = await getDefaultList(ctx.from.id);

  const deals = await Deal.findAll({ where: {
    listId: list.id
  }});
  console.log(deals)
  const listStr = deals.reduce((acc, curr) => `${acc}\n${curr.text}`, list.name + '\n');
  return ctx.reply(listStr);
});

module.exports = listViewScene;
