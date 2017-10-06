const Dialog = require('./dialog');

/**
 * PromptDialog class.
 */
class PromptDialog extends Dialog {
  constructor(config, brain, parameters) {
    super(config, brain, parameters);
    this.maxComplexity = Object.keys(parameters.entities).length + 1;
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
    for (const messageEntity of messageEntities
               .filter((entity) => this.parameters.entities[entity.dim] !== undefined)) {
      console.log('PromptDialog.execute: messageEntity', messageEntity);
      // we want to keep the order to ease the testability
      // eslint-disable-next-line no-await-in-loop
      await this.entityConfirm(id, responses, messageEntity);
      dialogEntities[messageEntity.dim] = messageEntity;
    }
    console.log('PromptDialog.execute: dialogEntities', dialogEntities);
    await this.brain.conversationSet(id, this.parameters.namespace, dialogEntities);
    let extractionsDone = true;
    for (const entityKey of Object.keys(this.parameters.entities)) {
      console.log('PromptDialog.execute: entityKey', entityKey, dialogEntities[entityKey]);
      if (dialogEntities[entityKey] === undefined) {
        // we want to keep the order to ease the testability
        // eslint-disable-next-line no-await-in-loop
        await this.entityAsk(id, responses, entityKey);
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
  async entityConfirm(id, responses, entity) {
    console.log('PromptDialog.entityConfirm', id, responses, entity);
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
  async entityAsk(id, responses, entityKey) {
    console.log('PromptDialog.entityAsk', id, responses, entityKey);
    this.textMessage(id,
                     responses,
                     `${this.parameters.namespace}_${entityKey}_ask`,
                     { entity: entityKey });
  }
}

module.exports = PromptDialog;
