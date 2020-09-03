const Scene = require('telegraf/scenes/base');

// List view scene
const listViewScene = new Scene('list-view');
listViewScene.enter((ctx) => ctx.reply('List of deals'));

module.exports = listViewScene;
