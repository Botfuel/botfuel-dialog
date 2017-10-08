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
  async execute(id, responses, messageEntities, dialogAge) {
    console.log('PromptDialog.execute', id, responses, messageEntities, age);
    messageEntities = messageEntities
      .filter(entity => this.parameters.entities[entity.dim] !== undefined);
    const dialogEntities = await this.brain.conversationGet(id, this.parameters.namespace) || {};
    for (const messageEntity of messageEntities) {
      dialogEntities[messageEntity.dim] = messageEntity;
    }
    console.log('PromptDialog.execute: dialogEntities', dialogEntities);
    await this.brain.conversationSet(id, this.parameters.namespace, dialogEntities);
    this.confirm(id, responses, messageEntities, age);
    const missingEntities = Object
          .keys(this.parameters.entities)
          .filter(entityKey => dialogEntities[entityKey] === undefined);
    this.ask(id, responses, missingEntities);
    return missingEntities.length !== 0;
  }

  ask(id, responses, entities) {
    console.log('PromptDialog.ask', id, responses, entities);
    // TODO: put all this in a single template
    for (const entityKey of entities) {
      this.textMessage(id,
                       responses,
                       `${this.parameters.namespace}_${entityKey}_ask`,
                       { entity: entityKey });
    }
  }

  confirm(id, responses, entities, dialogAge) {
    console.log('PromptDialog.confirm', id, responses, entities, dialogAge);
    // TODO: put all this in a single template
    if (dialogAge > 0) {
      this.textMessage(id,
                       responses,
                       `${this.parameters.namespace}_confirm`);
    }
    for (const entity of entities) {
      this.textMessage(id,
                       responses,
                       `${this.parameters.namespace}_${entity.dim}_confirm`,
                       { entity });
    }
  }
}

module.exports = PromptDialog;
