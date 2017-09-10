const Dialog = require('./dialog');

/**
 * PromptDialog class.
 */
PromptDialog extends Dialog {
  /**
   * Executes.
   * @param {Object} dm the dialog manager
   * @param {string} id the user id
   * @param {Object[]} messageEntities - entities array from user message
   * @param {string[]} responses - responses array
   */
  async execute(dm, id, messageEntities, responses) {
    console.log('PromptDialog.execute', '<dm>', id, messageEntities);
    await dm
      .brain
      .get(id, this.parameters.namespace)
      .then((dialogEntitiesData) => {
        console.log('PromptDialog.execute: dialogEntities', dialogEntitiesData);
        const dialogEntities = dialogEntitiesData || {};
        for (const messageEntity of messageEntities) {
          console.log('PromptDialog.execute: messageEntity', messageEntity);
          if (this.parameters.entities[messageEntity.dim] !== null) {
            await this.confirm(dm, id, messageEntity, responses);
            dialogEntities[messageEntity.dim] = messageEntity;
          }
      }
        console.log('PromptDialog.execute: dialogEntities', dialogEntities);
        await dm
          .brain
          .set(id, this.parameters.namespace, dialogEntities)
          .then(() => {
            let extractionsDone = true;
            for (const entityKey of Object.keys(this.parameters.entities)) {
              if (dialogEntities[entityKey] === null) {
                await this.ask(dm, id, entityKey, responses);
                extractionsDone = false;
              }
            }
            return Promise.resolve(extractionsDone);
          });
      });
  }

  /**
   * Confirms the entity.
   * @param {Object} dm the dialog manager
   * @param {string} id the user id
   * @param {Object} entity the entity
   */
  async confirm(dm, id, entity, responses) {
    console.log('PromptDialog.confirm', '<dm>', id, entity);
    return await dm.say(id, 'entity_confirm', { entity }, responses);
  }

  /**
   * Asks the entity.
   * @param {Object} dm the dialog manager
   * @param {string} id the user id
   * @param {string} entityKey the entityKey
   */
  async ask(dm, id, entityKey, responses) {
    console.log('PromptDialog.ask', '<dm>', id, entityKey);
    return await dm.say(id, 'entity_ask', { entity: entityKey }, responses);
  }
}

module.exports = PromptDialog;
