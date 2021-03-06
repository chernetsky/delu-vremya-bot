const Scene = require('telegraf/scenes/base');
const createWizard = require('./createWizard');
const { models } = require('../../db/db');
const { getCurrentList } = require('../../helpers/helpers');

const { Deal } = models;

// Deal creation scene
const dealCreateScene = new Scene('deal-create');

dealCreateScene.enter(createWizard.middleware());

dealCreateScene.use(createWizard.middleware());

// createWizard

dealCreateScene.leave(async (ctx, next) => {
  if (ctx.wizard) {
    const { deal: descriptor } = ctx.wizard.state;

    if (descriptor) {
      const currentList = await getCurrentList(descriptor.userId);
      descriptor.listId = currentList.id;

      const deal = await Deal.create(descriptor);

      console.log(`Created deal ${deal.text}`);

      delete ctx.wizard;
    }
  }

  return next();
});

module.exports = dealCreateScene;
