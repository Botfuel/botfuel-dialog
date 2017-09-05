const Dialog = require('./dialog');

/**
 * PromptDialog class.
 */
class PromptDialog extends Dialog {
  /**
   * Executes.
   * @param {Object} dm the dialog manager
   * @param {string} id the user id
   */
  execute(dm, id, messageEntities) {
    console.log('PromptDialog.execute', '<dm>', id, messageEntities);
    const dialogEntities = User.get(id, dm.context, this.parameters.namespace) || {};
    console.log('PromptDialog.execute: dialogEntities', dialogEntities);
    for (const messageEntity of messageEntities) {
      console.log('PromptDialog.execute: messageEntity', messageEntity);
      if (this.parameters.entities[messageEntity.dim] !== null) {
        this.confirm(dm, id, messageEntity);
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

  /**
   * Confirms the entity.
   * @param {Object} dm the dialog manager
   * @param {string} id the user id
   * @param {Object} entity the entity
   */
  confirm(dm, id, entity) {
    console.log('PromptDialog.confirm', '<dm>', id, entity);
    dm.say(id, 'entity_confirm', { entity });
  }

  /**
   * Asks the entity.
   * @param {Object} dm the dialog manager
   * @param {string} id the user id
   * @param {string} entityKey the entityKey
   */
  ask(dm, id, entityKey) {
    console.log('PromptDialog.ask', '<dm>', id, entityKey);
    dm.say(id, 'entity_ask', { entity: entityKey });
  }
}

module.exports = PromptDialog;
