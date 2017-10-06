const Dialog = require('./dialog');

/**
 * PromptDialog class.
 */
class PromptDialog extends Dialog {
  constructor(config, brain, parameters) {
    super(config, brain, parameters);
    this.maxComplexity = Object.keys(parameters.entities).length;
  }

  /**
   * Executes.
   * @param {string} id the user id
   * @param {Object[]} responses
   * @param {Object[]} messageEntities - entities array from user message
   */
  async execute(id, responses, messageEntities) {
    console.log('PromptDialog.execute', id, messageEntities);
    const dialogEntities = await this.brain.conversationGet(id, this.parameters.namespace) || {};
    console.log('PromptDialog.execute: dialogEntities', dialogEntities);
    for (const messageEntity of messageEntities) {
      console.log('PromptDialog.execute: messageEntity', messageEntity);
      // if the message entity is of interest for this dialog
      if (this.parameters.entities[messageEntity.dim] !== undefined) {
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
   * @param {Object[]} responses
   * @param {Object} entity the entity
   */
  async confirm(id, responses, entity) {
    console.log('PromptDialog.confirm', id, responses, entity);
    this.textMessage(id,
                     responses,
                     `${this.parameters.namespace}_${entity.dim}_confirm`,
                     { entity });
  }

  /**
   * Asks the entity.
   * @param {string} id the user id
   * @param {Object[]} responses
   * @param {string} entityKey the entityKey
   */
  async ask(id, responses, entityKey) {
    console.log('PromptDialog.ask', id, responses, entityKey);
    this.textMessage(id,
                     responses,
                     `${this.parameters.namespace}_${entityKey}_ask`,
                     { entity: entityKey });
  }
}

module.exports = PromptDialog;
