const r = require('ramda');
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

const weekButtonDescriptors = {
  monday: 'Пн',
  tuesday: 'Вт',
  wednesday: 'Ср',
  thursday: 'Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс'
};

let weekSelected = Object.keys(weekButtonDescriptors);

const makeKeyboard = r.compose(
  Markup.inlineKeyboard,
  r.splitEvery(5),
  r.append(Markup.callbackButton('➡️', 'next')),
  r.map((item) => Markup.callbackButton(item[1], item[0])),
  r.map(([k, v]) => [k, weekSelected.indexOf(k) == -1 ? v : `*${v}`]),
  r.toPairs
);

const weekHandler = new Composer();

/**
 * Week day selection callback.
 */
weekHandler.action(Object.keys(weekButtonDescriptors), (ctx) => {
  const selection = ctx.callbackQuery.data;
  if (weekSelected.indexOf(selection) == -1) {
    weekSelected.push(selection);
  } else {
    weekSelected = weekSelected.filter((item) => item != selection);
  }

  ctx.editMessageReplyMarkup(makeKeyboard(weekButtonDescriptors));
});

weekHandler.action('next', (ctx) => {
  ctx.reply('Step 2');
  return ctx.wizard.next();
});

weekHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button'));

const step2Handler = new Composer();
step2Handler.command('next', (ctx) => {
  ctx.reply('Done 1');
  return ctx.wizard.next();
});
step2Handler.use((ctx) => ctx.replyWithMarkdown('Type /next'));

const createWizard = new WizardScene(
  'deal-create-wizard',
  (ctx) => {
    ctx.reply('Дни недели', makeKeyboard(weekButtonDescriptors).extra());
    return ctx.wizard.next();
  },
  weekHandler,
  step2Handler,
  (ctx) => {
    ctx.reply('Done 2');
    return ctx.scene.leave();
  }
);

module.exports = createWizard;
