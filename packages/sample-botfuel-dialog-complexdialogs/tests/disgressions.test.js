/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('Disgressions', function () {
  describe('One turn', () => {
    it('should handle digressions', async function () {
      const bot = new Bot(config);
      const userId = bot.adapter.userId;
      await bot.play([
        new UserTextMessage('I am leaving from Paris'),
        new UserTextMessage('Hello'),
        new UserTextMessage('tomorrow'),
      ]);
      expect(bot.adapter.log).to.eql([
        new UserTextMessage('I am leaving from Paris'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
        new UserTextMessage('Hello'),
        new BotTextMessage('Hello human!'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
        new UserTextMessage('tomorrow'),
        new BotTextMessage('Entities defined: time, city'),
      ].map(msg => msg.toJson(userId)));
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      const lastConversation = await bot.brain.getLastConversation(userId);
      expect(user.conversations.length).to.be(1);
      expect(dialogs.stack).to.be.empty();
      expect(lastConversation).to.have.property('travel');
      expect(lastConversation.travel).to.have.property('city');
      expect(lastConversation.travel).to.have.property('time');
      expect(lastConversation.travel.city.body).to.be('Paris');
      expect(lastConversation.travel.time.body).to.be('tomorrow');
    });
  });

  describe('Two turns', () => {
    it('should handle two turn digressions', async function () {
      const bot = new Bot(config);
      const userId = bot.adapter.userId;
      await bot.play([
        new UserTextMessage('I leave from Paris'),
        new UserTextMessage('Ask me my name'),
        new UserTextMessage('John'),
        new UserTextMessage('tomorrow'),
      ]);
      expect(bot.adapter.log).to.eql([
        new UserTextMessage('I leave from Paris'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
        new UserTextMessage('Ask me my name'),
        new BotTextMessage('Entities defined: '),
        new BotTextMessage('Entities needed: name'),
        new BotTextMessage('Which name?'),
        new UserTextMessage('John'),
        new BotTextMessage('Entities defined: name'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
        new UserTextMessage('tomorrow'),
        new BotTextMessage('Entities defined: time, city'),
      ].map(msg => msg.toJson(userId)));
      const user = await bot.brain.getUser(bot.adapter.userId);
      const dialogs = await bot.brain.getDialogs(userId);
      const lastConversation = await bot.brain.getLastConversation(bot.adapter.userId);
      expect(user.conversations.length).to.be(1);
      expect(dialogs.stack).to.be.empty();
      expect(lastConversation).to.have.property('travel');
      expect(lastConversation.travel).to.have.property('city');
      expect(lastConversation.travel).to.have.property('time');
      expect(lastConversation.travel.city.body).to.be('Paris');
      expect(lastConversation.travel.time.body).to.be('tomorrow');
      expect(lastConversation.name).to.have.property('name');
      expect(lastConversation.name.name.body).to.be('John');
    });
  });
});
