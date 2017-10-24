const fs = require('fs');
const _ = require('lodash');
const BotTextMessage = require('./parts/bot_text_message');

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

class TextView {
  static render(botId, userId, templatePath, parameters) {
    console.log('TextView.compile');
    return fs
      .readFileSync(templatePath, 'utf8')
      .toString()
      .split('\n')
      .map(line => _.template(line)(parameters))
      .filter(Boolean)
      .map(text => new BotTextMessage(botId, userId, text).toJson());
  }
}

module.exports = TextView;
