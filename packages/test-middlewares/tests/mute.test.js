/* eslint prefer-arrow-callback: "off" */

const expect = require("expect.js");
const { Bot, BotTextMessage, UserTextMessage } = require("botfuel-dialog");
const config = require("../test-config");

describe("Mute", function() {
  it("should mute the bot", async function() {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage("Mute")]);
    await bot.play([new UserTextMessage("What's up")]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage("Mute"),
        new BotTextMessage("Muted!"),
        new UserTextMessage("What's up")
      ].map(msg => msg.toJson(userId))
    );
  });
});
