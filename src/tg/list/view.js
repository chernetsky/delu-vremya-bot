const r = require('ramda');
const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');
const { split: chunksSplit } = require('split-text-to-chunks');
const pixelWidth = require('string-pixel-width');
const { models } = require('../../db/db');
const { getCurrentList } = require('../../helpers/helpers');
const { getUndoneAt } = require('../../helpers/time');
const { SETTINGS, TEXT_METRICS, PIXEL_WIDTH_SETTINGS } = require('../../constants');

const { Deal } = models;

// List view scene
const listViewScene = new Scene('list-view');

/**
 * Initializes current list context fields.
 *
 * @param {TelegrafContext} ctx
 * @param {Function} next
 */
const initState = async (ctx, next) => {
  if (!ctx.scene.state.list) {
    const list = await getCurrentList(ctx.from.id);
    ctx.scene.state.list = { id: list.id, name: list.name };
  }
  return next();
};

listViewScene.use(initState);

listViewScene.enter(initState, async (ctx) => {
  const { id: listId, name: listName } = ctx.scene.state.list;

  const deals = await findListDeals(listId);

  return ctx.reply(listName, makeKeyboard(deals).extra());
});

listViewScene.action(/^!?deal_\d+/, async (ctx) => {
  const { data } = ctx.callbackQuery;

  let done = data.indexOf('!') == 0;
  const id = data.replace(/^!?deal_/, '');
  if (id) {
    done = !done;

    let undoneAt = null;
    if (done) {
      undoneAt = getUndoneAt();
    }
    
    await Deal.update({ done, undoneAt }, { where: { id } });
  }

  const { id: listId } = ctx.scene.state.list;

  if (!listId) {
    // Session expired
    throw new Error('No list id');
  }

  const deals = await findListDeals(listId);

  let res;
  try {
    res = await ctx.editMessageReplyMarkup(makeKeyboard(deals));
  } catch (err) {
    // Message is not modified
  }

  return res;
});

/**
 * Removing done deals from list.
 */
listViewScene.action('clear', async (ctx) => {
  const { id: listId } = ctx.scene.state.list;

  await Deal.update({ cleared: true }, { where: { listId, done: true, cleared: false } });

  const deals = await findListDeals(listId);

  let res;
  try {
    res = await ctx.editMessageReplyMarkup(makeKeyboard(deals));
  } catch (err) {
    // Message is not modified
  }

  return res;
});

const findListDeals = (listId) =>
  Deal.findAll({
    where: {
      listId,
      cleared: false
    },
    order: [['createdAt']]
  });

const listOperationsButtons = [
  // Markup.callbackButton('🗑', 'delete'),
  // Markup.callbackButton('🔨', 'new'),
  // Markup.callbackButton('✏️', 'edit'),
  Markup.callbackButton('🧽', 'clear')
];

const makeDealLabel = (deal) => {
  const icon = deal.periodic ? '🔆' : '❗️';
  const text = icon + deal.text;
  const done = deal.done ? '✅' : '⬜️';

  const { dealButtonLength, maxPixelWidth, donePixelWidth, spacePixelWidth } = TEXT_METRICS;
  const chunks = chunksSplit(text, dealButtonLength);
  let first = chunks[0];

  const d = maxPixelWidth - pixelWidth(first, PIXEL_WIDTH_SETTINGS) + donePixelWidth;
  const spacesCount = Math.floor(d / spacePixelWidth);
  first += Array(spacesCount).fill(' ').join('') + done;

  chunks[0] = first;

  // console.log(first, pixelWidth(first, { font: 'impact', size: 10 }));
  // const testStr = Array(DEAL_BUTTON_LENGTH).fill('Щ').join('');
  // console.log(pixelWidth(testStr, { font: 'impact', size: 10 }));

  return chunks.join('\n');
};

const makeKeyboard = r.compose(
  Markup.inlineKeyboard,
  r.append(listOperationsButtons),
  r.splitEvery(1),
  r.map((item) => Markup.callbackButton(item.text, item.data)),
  r.map(
    r.applySpec({
      text: makeDealLabel,
      data: (item) => `${item.done ? '!' : ''}deal_${item.id}`
    })
  )
);

module.exports = listViewScene;
