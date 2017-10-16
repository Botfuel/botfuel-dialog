const Dialog = require('./dialog');

/**
 * PromptDialog class.
 */
class PromptDialog extends Dialog {
  constructor(config, brain, parameters) {
    super(config, brain, parameters);
    this.maxComplexity = Object.keys(parameters.entities).length + 1;
  }

  async computeMissingEntities(id, messageEntities) {
    console.log('PromptDialog.computeMissingEntities', messageEntities);
    const dialogEntities = await this.brain.conversationGet(id, this.parameters.namespace) || {};
    for (const messageEntity of messageEntities) {
      dialogEntities[messageEntity.dim] = messageEntity;
    }
    console.log('PromptDialog.computeMissingEntities: dialogEntities', dialogEntities);
    await this.brain.conversationSet(id, this.parameters.namespace, dialogEntities);
    return Object
      .keys(this.parameters.entities)
      .filter(entityKey => dialogEntities[entityKey] === undefined);
  }

  /**
   * Executes.
   * @param {string} id the user id
   * @param {Object[]} responses
   * @param {Object[]} messageEntities - entities array from user message
   */
  async execute(id, responses, messageEntities, confirmDialog) {
    console.log('PromptDialog.execute', id, responses, messageEntities, confirmDialog);
    messageEntities = messageEntities
      .filter(entity => this.parameters.entities[entity.dim] !== undefined);
    this.confirm(id, responses, messageEntities, confirmDialog);
    const missingEntities = await this.computeMissingEntities(id, messageEntities);
    this.ask(id, responses, missingEntities);
    return missingEntities.length === 0;
  }

  ask(id, responses, entities) {
    console.log('PromptDialog.ask', id, responses, entities);
    // TODO: put all this in a single template
    for (const entityKey of entities) {
      this.pushMessages(responses, this.textMessages(id,
                                                     `${this.parameters.namespace}_${entityKey}_ask`,
                                                     { entity: entityKey }));
    }
  }

  confirm(id, responses, entities, confirmDialog) {
    console.log('PromptDialog.confirm', id, responses, entities, confirmDialog);
    // TODO: put all this in a single template
    if (confirmDialog) {
      this.pushMessages(responses, this.textMessages(id,
                                                     `${this.parameters.namespace}_confirm`));
    }
    for (const entity of entities) {
      this.pushMessages(responses, this.textMessages(id,
                                                     `${this.parameters.namespace}_${entity.dim}_confirm`,
                                                     { entity }));
    }
  }
}

module.exports = PromptDialog;
