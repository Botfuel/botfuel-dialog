const Dialog = require('./dialog');

/**
 * PromptDialog class.
 */
class PromptDialog extends Dialog {
  /**
   * Executes.
   * @param {string} id the user id
   * @param {Object[]} messageEntities - entities array from user message
   */
  async execute(id, responses, messageEntities) {
    console.log('PromptDialog.execute', id, messageEntities);
    let dialogEntities = await this.brain.conversationGet(id, this.parameters.namespace) || {};
    console.log('PromptDialog.execute: dialogEntities', dialogEntities);
    for (const messageEntity of messageEntities) {
      console.log('PromptDialog.execute: messageEntity', messageEntity);
      if (this.parameters.entities[messageEntity.dim] !== null) {
        // we want to keep the order to ease the testability
        // eslint-disable-next-line no-await-in-loop
        await this.confirm(id, responses, messageEntity);
        dialogEntities[messageEntity.dim] = messageEntity;
      }
    }
    console.log('PromptDialog.execute: dialogEntities', dialogEntities);
    await this.brain.conversationSet(id, this.parameters.namespace, dialogEntities);
    let extractionsDone = true;
    for (const entityKey of Object.keys(this.parameters.entities)) {
      console.log('PromptDialog.execute: entityKey', entityKey);
      console.log('PromptDialog.execute: entityKey', dialogEntities[entityKey]);
      if (dialogEntities[entityKey] === undefined) {
        // we want to keep the order to ease the testability
        // eslint-disable-next-line no-await-in-loop
        await this.ask(id, responses, entityKey);
        extractionsDone = false;
      }
    }
    return extractionsDone;
  }

  /**
   * Confirms the entity.
   * @param {string} id the user id
   * @param {Object} entity the entity
   */
  async confirm(id, responses, entity) {
    console.log('PromptDialog.confirm', id, responses, entity);
    await this.textMessage(id, responses, 'entity_confirm', { entity });
  }

  /**
   * Asks the entity.
   * @param {string} id the user id
   * @param {string} entityKey the entityKey
   */
  async ask(id, responses, entityKey) {
    console.log('PromptDialog.ask', id, responses, entityKey);
    await this.textMessage(id, responses, 'entity_ask', { entity: entityKey });
  }
}

module.exports = PromptDialog;
