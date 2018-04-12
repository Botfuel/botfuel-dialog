/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { PromptView, BotTextMessage } = require('botfuel-dialog');

const members = {
  myWeight: 'you weigh',
  fatherWeight: 'your male genitor weighs',
  motherWeight: 'your female genitor weighs',
};
const weightMessage = (key, entityValue) =>
  new BotTextMessage(`Cool, so ${members[key]} ${entityValue.value}`);

class WeightView extends PromptView {
  render(userMessage, { matchedEntities, missingEntities }) {
    const messages = Object.keys(matchedEntities)
      .filter(key => !!matchedEntities[key])
      .map(key => weightMessage(key, matchedEntities[key].values[0]));

    if (missingEntities.has('fatherWeight')) {
      messages.push(new BotTextMessage('What about your male genitor?'));
    } else if (missingEntities.has('motherWeight')) {
      messages.push(new BotTextMessage('What about your female genitor?'));
    }

    if (missingEntities.size === 0) {
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
