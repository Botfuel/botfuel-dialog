'use strict';

const Dialog = require('./dialog');
const User = require('@botfuel/bot-common').User;

class PromptDialog extends Dialog {
  constructor(dm, entities, parameters) {
    super(dm, parameters);
    this.entities = entities;
  }

  execute(id, responses) {
    let entitiesToExtract = this.entities;
    responses.push(`entities to extract ${ JSON.stringify(entitiesToExtract) }`);
    let entitiesExtracted = User.get(id, this.dm.context, '_entities');
    responses.push(`entities extracted ${ JSON.stringify(entitiesExtracted) }`);
    return Promise.resolve(true);
  }
}

module.exports = PromptDialog;
