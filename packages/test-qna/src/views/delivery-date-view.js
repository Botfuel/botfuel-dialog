const { TextView, BotTextMessage } = require('botfuel-dialog');

class DeliveryDateView extends TextView {
  render(data) {
    const { date } = data;
    const dateStr = date.toISOString().split('T')[0];

    const response = new BotTextMessage(`If you purchase today before 10pm, you purchase will be delivered by ${dateStr}.`);

    return [response];
  }
}

module.exports = DeliveryDateView;
