const User = require('@botfuel/bot-common').User;
const Dialog = require('./dialog');

class PromptDialog extends Dialog {
  execute(dm, id) {
    console.log('PromptDialog.execute', '<dm>', id);
    const messageEntities = User.get(id, dm.context, '_entities');
    console.log('PromptDialog.execute: messageEntities', messageEntities);
    const dialogEntities = User.get(id, dm.context, this.parameters.namespace) || {};
    console.log('PromptDialog.execute: dialogEntities', dialogEntities);
    for (const messageEntity of messageEntities) {
      console.log('PromptDialog.execute: messageEntity', messageEntity);
      if (this.parameters.entities[messageEntity.dim] !== null) {
        this.confirm(dm, id, messageEntity.dim, messageEntity);
        dialogEntities[messageEntity.dim] = messageEntity;
      }
    }
    console.log('PromptDialog.execute: dialogEntities', dialogEntities);
    User.set(id, dm.context, this.parameters.namespace, dialogEntities);
    let extractionsDone = true;
    for (const entityKey of Object.keys(this.parameters.entities)) {
      if (dialogEntities[entityKey] == null) {
        this.ask(dm, id, entityKey);
        extractionsDone = false;
      }
    }
    return Promise.resolve(extractionsDone);
  }

  confirm(dm, id, entityKey, entity) {
    dm.say(id, 'entity_confirm', { entity });
  }

  ask(dm, id, entityKey) {
    dm.say(id, 'entity_ask', { entityKey });
  }
}

module.exports = PromptDialog;
