const { PromptView, BotTextMessage } = require('botfuel-dialog');

const members = {
  myWeight: 'you weigh',
  fatherWeight: 'your male genitor weighs',
  motherWeight: 'your female genitor weighs',
};
const weightMessage = (key, entityValue) => new BotTextMessage(`Cool, so ${members[key]} ${entityValue.value}`);

class WeightView extends PromptView {
  renderEntities(matchedEntities, missingEntities) {
    const messages = Object.keys(matchedEntities)
      .filter(key => !!matchedEntities[key])
      .map(key => weightMessage(key, matchedEntities[key].values[0]));

    if (missingEntities.fatherWeight) {
      messages.push(new BotTextMessage('What about your male genitor?'));
    } else if (missingEntities.motherWeight) {
      messages.push(new BotTextMessage('What about your female genitor?'));
    }

    if (!Object.keys(missingEntities).length) {
      const totalWeight = Object.keys(matchedEntities).reduce(
        (total, key) => total + matchedEntities[key].values[0].value,
        0,
      );
      let remark = 'Your family is pretty average.';

      if (totalWeight < 190) {
        remark = 'Your family is pretty light!';
      }

      if (totalWeight > 240) {
        remark = 'Your family is pretty heavy...';
      }

      messages.push(new BotTextMessage(remark));
      if (totalWeight > 240 && matchedEntities.motherWeight.values[0].value > 80) {
        messages.push(new BotTextMessage('Your female genitor especially!'));
      }
    }

    return messages;
  }
}

module.exports = WeightView;
