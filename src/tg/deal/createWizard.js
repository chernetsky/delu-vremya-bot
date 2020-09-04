const r = require('ramda');
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const { WHEN } = require('../../constants');

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
  r.append(Markup.callbackButton('✅', 'done')),
  r.map((item) => Markup.callbackButton(item[1], item[0])),
  r.map(([k, v]) => [k, weekSelected.indexOf(k) == -1 ? v : `*${v}`]),
  r.toPairs
);

const whenHandler = new Composer();

/**
 * Week day selection callback.
 */
whenHandler.action(Object.keys(weekButtonDescriptors), (ctx) => {
  const selection = ctx.callbackQuery.data;
  if (weekSelected.indexOf(selection) == -1) {
    weekSelected.push(selection);
  } else {
    weekSelected = weekSelected.filter((item) => item != selection);
  }

  ctx.wizard.state.deal.when = weekSelected.length == 7 ? WHEN.EVERYDAY : weekSelected.map((day) => day.slice(0, 3)).join(':');

  ctx.editMessageReplyMarkup(makeKeyboard(weekButtonDescriptors));
});

/**
 * Exit 'deal-create' scene.
 */
whenHandler.action('done', (ctx) => {
  return ctx.scene.leave();
});

whenHandler.use((ctx) => ctx.replyWithMarkdown('Нажмите `✅` для завершения.'));

const createWizard = new WizardScene(
  'deal-create-wizard',
  (ctx) => {
    const dealDescriptor = (ctx.wizard.state.deal = {
      periodic: true // DEBUG
    });
    dealDescriptor.text = ctx.message.text;
    dealDescriptor.userId = ctx.message.from.id;

    ctx.reply('Дни недели', makeKeyboard(weekButtonDescriptors).extra());

    return ctx.wizard.next();
  },
  whenHandler
);

module.exports = createWizard;
