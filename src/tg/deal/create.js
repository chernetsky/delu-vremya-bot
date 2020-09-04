const Scene = require('telegraf/scenes/base');
const createWizard = require('./createWizard');
const { models: { Deal } } = require('../../db/db');
const { getDefaultList } = require('../../helpers/helpers');

// Deal creation scene
const dealCreateScene = new Scene('deal-create');

dealCreateScene.enter(createWizard.middleware());

dealCreateScene.use(createWizard.middleware());

// createWizard

dealCreateScene.leave(async (ctx, next) => {
  if (ctx.wizard) {
    const { deal: descriptor } =  ctx.wizard.state;

    if (descriptor) {
      const defaultList  = await getDefaultList(descriptor.userId);
      descriptor.listId = defaultList.id;
  
      const deal = await Deal.create(descriptor);
  
      console.log(`Created deal ${deal.text}`)
  
      delete ctx.wizard;
    }
  }

  return next();
});

module.exports = dealCreateScene;
