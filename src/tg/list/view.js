const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')

// Handler factoriess
const { enter, leave } = Stage

// Greeter scene
const listViewScene = new Scene('list-view')
listViewScene.enter((ctx) => ctx.reply('List of deals'))
// listViewScene.leave((ctx) => ctx.reply('Bye'))
// listViewScene.hears('hi', enter('list-view'))
// listViewScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'))

module.exports = listViewScene;