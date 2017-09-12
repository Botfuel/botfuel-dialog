const Dialog = require('./dialog');

/**
 * PromptDialog class.
 */
class PromptDialog extends Dialog {
  /**
   * Executes.
   * @param {Object} dm the dialog manager
   * @param {string} id the user id
   * @param {Object[]} messageEntities - entities array from user message
   */
  async execute(dm, id, messageEntities) {
    console.log('PromptDialog.execute', '<dm>', id, messageEntities);
    const dialogEntitiesData = await dm.brain.conversationGet(id, this.parameters.namespace);
    console.log('PromptDialog.execute: dialogEntitiesData', dialogEntitiesData);
    const dialogEntities = dialogEntitiesData || {};
    for (const messageEntity of messageEntities) {
      console.log('PromptDialog.execute: messageEntity', messageEntity);
      if (this.parameters.entities[messageEntity.dim] !== null) {
        await this.confirm(dm, id, messageEntity);
        dialogEntities[messageEntity.dim] = messageEntity;
      }
    }
    console.log('PromptDialog.execute: dialogEntities', dialogEntities);
    await dm.brain.conversationSet(id, this.parameters.namespace, dialogEntities);
    let extractionsDone = true;
    for (const entityKey of Object.keys(this.parameters.entities)) {
      console.log('PromptDialog.execute: entityKey', entityKey);
      console.log('PromptDialog.execute: entityKey', dialogEntities[entityKey]);
      if (dialogEntities[entityKey] === undefined) {
        await this.ask(dm, id, entityKey);
        extractionsDone = false;
      }
    }
    return extractionsDone;
  }

  /**
   * Confirms the entity.
   * @param {Object} dm the dialog manager
   * @param {string} id the user id
   * @param {Object} entity the entity
   */
  async confirm(dm, id, entity) {
    console.log('PromptDialog.confirm', '<dm>', id, entity);
    await dm.say(id, 'entity_confirm', { entity });
  }

  /**
   * Asks the entity.
   * @param {Object} dm the dialog manager
   * @param {string} id the user id
   * @param {string} entityKey the entityKey
   */
  async ask(dm, id, entityKey) {
    console.log('PromptDialog.ask', '<dm>', id, entityKey);
    await dm.say(id, 'entity_ask', { entity: entityKey });
  }
}

module.exports = PromptDialog;
