const Scene = require('telegraf/scenes/base');
const createWizard = require('./createWizard');

// Deal creation scene
const dealCreateScene = new Scene('deal-create');

dealCreateScene.enter(createWizard.middleware());
dealCreateScene.use(createWizard.middleware());
dealCreateScene.leave((ctx, next) => {
  ctx.state.deal = ctx.wizard.state.deal;
  return next();
});

module.exports = dealCreateScene;
