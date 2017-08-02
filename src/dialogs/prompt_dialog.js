const User = require('@botfuel/bot-common').User;
const Dialog = require('./dialog');

class PromptDialog extends Dialog {
  execute(dm, id) {
    console.log('PromptDialog.execute', '<dm>', id);
    const entitiesLocallyExtracted = User.get(id, dm.context, '_entities');
    console.log('PromptDialog.execute: entitiesLocallyExtracted', entitiesLocallyExtracted);
    const entitiesGloballyExtracted = User.get(id, dm.context, this.parameters.namespace) || {};
    console.log('PromptDialog.execute: entitiesGloballyExtracted', entitiesGloballyExtracted);
    for (const entity of entitiesLocallyExtracted) {
      console.log('PromptDialog.execute: entityLocallyExtracted', entity);
      if (this.parameters.entities[entity.dim] !== null) {
        dm.say(id, this.parameters.entities[entity.dim].confirm_template, { entity });
        entitiesGloballyExtracted[entity.dim] = entity;
      }
    }
    console.log('PromptDialog.execute: entitiesGloballyExtracted', entitiesGloballyExtracted);
    User.set(id, dm.context, this.parameters.namespace, entitiesGloballyExtracted);
    let extractionsDone = true;
    for (const entity of Object.keys(this.parameters.entities)) {
      if (entitiesGloballyExtracted[entity] == null) {
        extractionsDone = false;
        dm.say(id, this.parameters.entities[entity].ask_template, { entity });
      }
    }
    return Promise.resolve(extractionsDone);
  }
}

module.exports = PromptDialog;
