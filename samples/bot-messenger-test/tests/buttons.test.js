const expect = require('expect.js');
const sdk2 = require('@botfuel/bot-sdk2');
const config = require('../test_config');

const Messages = sdk2.Messages;

it('should understand the click on a button', async function () {
  const bot = new sdk2.Bot(config);
  const botId = config.id;
  const userId = bot.adapter.userId;
  await bot.play([
    Messages.userText(botId, userId, 'montre moi des boutons'),
    Messages.userPostback(botId, userId, {
      dialog: { label: 'buttons' },
      entities: [{ dim: 'button', value: 1 }],
    }),
  ]);
  expect(bot.adapter.log).to.eql([
    Messages.userText(botId, userId, 'montre moi des boutons'),
    Messages.botActions(botId, userId, [
      {
        type: 'postback',
        text: 'text 1',
        value: {
          dialog: { label: 'buttons' },
          entities: [{ dim: 'button', value: 1 }],
        },
      },
      {
        type: 'postback',
        text: 'text 2',
        value: {
          dialog: { label: 'buttons' },
          entities: [{ dim: 'button', value: 2 }],
        },
      },
    ], {
      text: "Voici des boutons!"
    }),
    Messages.userPostback(botId, userId, {
      dialog: { label: 'buttons' },
      entities: [{ dim: 'button', value: 1 }],
    }),
    Messages.botText(botId, userId, 'Tu as cliqué sur le bouton 1.'),
  ]);
  const user = await bot.brain.getUser(userId);
  expect(user.botId).to.be(botId);
  expect(user.userId).to.be(userId);
  expect(user.conversations.length).to.be(1);
  expect(user.dialogs).to.be.empty();
  expect(user.lastDialog.label).to.be('buttons');
});
