const User = require('@botfuel/bot-common').User;
const Dialog = require('./dialog');
const Confirm = require('./confirm');

class PromptDialog extends Dialog {
  execute(dm, id) {
    console.log('HEYHEY');
    console.log('PromptDialog.execute', '<dm>', id);
    const entitiesLocallyExtracted = User.get(id, dm.context, '_entities');
    console.log('PromptDialog.execute: entitiesLocallyExtracted', entitiesLocallyExtracted);
    const entitiesGloballyExtracted = User.get(id, dm.context, this.parameters.namespace) || {};
    console.log('PromptDialog.execute: entitiesGloballyExtracted', entitiesGloballyExtracted);
    for (const entity of entitiesLocallyExtracted) {
      console.log('PromptDialog.execute: entityLocallyExtracted', entity);
      if (this.parameters.entities.includes(entity.dim)) {
        dm.next(id, 'confirm', entity);
        entitiesGloballyExtracted[entity.dim] = entity;
      }
    }
    console.log('PromptDialog.execute: entitiesGloballyExtracted', entitiesGloballyExtracted);
    User.set(id, dm.context, this.parameters.namespace, entitiesGloballyExtracted);
    let extractionsDone = true;
    for (const entity of this.parameters.entities) {
      if (entitiesGloballyExtracted[entity] == null) {
        extractionsDone = false;
        dm.say(id, 'entity_to_extract', { entity: entity });
      }
    }
    return Promise.resolve(extractionsDone);
  }
}

module.exports = PromptDialog;
