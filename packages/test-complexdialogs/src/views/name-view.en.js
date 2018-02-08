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

class NameView extends PromptView {
  renderAsk() {
    return [new BotTextMessage('Do you still want me to ask your name?')];
  }

  renderConfirm() {
    return [new BotTextMessage('You still want me to ask your name.')];
  }

  renderDiscard() {
    return [new BotTextMessage("You don't want me to ask your name anymore.")];
  }
}

module.exports = NameView;
