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

const Action = require('./action');
/**
 * A postback action.
 * @extends Action
 */
class Postback extends Action {
  /**
   * @constructor
   * @param {String} text - the postback text
   * @param {String} dialog - the postback dialog name
   * @param {Object[]} entities - the dialog entities
   */
  constructor(text, dialog, entities) {
    const dataDialog = {
      name: 'postback',
      data: {
        messageEntities: entities,
      },
    };
    super('postback', text, { dialog, dataDialog });
  }

  /** @inheritDoc */
  validate() {
    super.validate();
    this.validateString(this.type, this.value.dialog);
    this.validateArray(this.type, this.value.dataDialog.data.messageEntities);
  }
}

module.exports = Postback;
