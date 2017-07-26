'use strict';

const Dialog = require('./dialog');
const User = require('@botfuel/bot-common').User;

class PromptDialog extends Dialog {
  execute(dm, id) {
    console.log("PromptDialog.execute", '<dm>', id);
    let entitiesToExtract = this.parameters.entities;
    console.log("PromptDialog.execute", entitiesToExtract);
    dm.say(id, 'entities_to_extract', { entities: JSON.stringify(entitiesToExtract) });
    let entitiesExtracted = User.get(id, dm.context, '_entities');
    console.log("PromptDialog.execute", entitiesExtracted);
    dm.say(id, 'entities_extracted', { entities: JSON.stringify(entitiesExtracted) });


    // TODO: compute the entities globally extracted (here we only take into account the entities extracted from last sentence)

    return Promise.resolve(true);
  }
}

module.exports = PromptDialog;
