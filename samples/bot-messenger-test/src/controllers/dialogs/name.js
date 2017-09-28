'use strict';

const sdk2 = require('@botfuel/bot-sdk2');

class Name extends sdk2.PromptDialog {
  constructor(config, brain) {
    super(config, brain, {
      namespace: 'name',
      entities: {
        forename: {},
      },
    });
  }

  async confirm(id, responses, entity) {
    this.textMessage(id, responses, `${entity.dim}_confirm`, { entity });
  }

  async ask(id, responses, entityKey) {
    this.textMessage(id, responses, `${entityKey}_ask`, { entity: entityKey });
  }
}

module.exports = Name;
