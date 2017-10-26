const Dialog = require('./dialog');

/**
 * PromptDialog class.
 */
class PromptDialog extends Dialog {
  constructor(config, brain, parameters) {
    super(config, brain, parameters);
    this.maxComplexity = Object.keys(parameters.entities).length + 1;
  }

  async computeMissingEntities(userId, messageEntities) {
    console.log('PromptDialog.computeMissingEntities', messageEntities);
    const { namespace, entities } = this.parameters;
    const dialogEntities = await this.brain.conversationGet(userId, namespace) || {};
    for (const messageEntity of messageEntities) {
      dialogEntities[messageEntity.dim] = messageEntity;
    }
    console.log('PromptDialog.computeMissingEntities: dialogEntities', dialogEntities);
    await this.brain.conversationSet(userId, namespace, dialogEntities);
    return Object.keys(entities).filter(entityKey => dialogEntities[entityKey] === undefined);
  }

  async executeWhenBlocked(userId, responses, messageEntities) {
    console.log('PromptDialog.executeWhenBlocked', userId, responses, messageEntities);
    this.display(userId, responses, 'ask', null);
    return Dialog.STATUS_WAITING;
  }

  async executeWhenWaiting(userId, responses, messageEntities) {
    console.log('PromptDialog.executeWhenWaiting');
    for (const messageEntity of messageEntities) {
      if (messageEntity.dim === 'system:boolean') {
        const booleanValue = messageEntity.values[0].value;
        console.log('PromptDialog.execute: system:boolean', booleanValue);
        if (booleanValue) {
          this.display(userId, responses, 'confirm', null);
          return this.executeWhenReady(userId, responses, messageEntities);
        }
        // if not confirmed, then discard dialog
        this.display(userId, responses, 'discard', null);
        return Dialog.STATUS_DISCARDED;
      }
    }
    return Dialog.STATUS_BLOCKED;
  }

  async executeWhenReady(userId, responses, messageEntities) {
    console.log('PromptDialog.executeWhenReady');
    // confirm entities
    messageEntities = messageEntities
      .filter(entity => this.parameters.entities[entity.dim] !== undefined);
    for (const entity of messageEntities) {
      this.display(userId, responses, `${entity.dim}_confirm`, { entity });
    }
    // ask entities
    const missingEntities = await this.computeMissingEntities(userId, messageEntities);
    if (missingEntities.length > 1) { // many entities
      this.display(userId, responses, 'entities_ask', { entities: missingEntities });
    } else if (missingEntities.length === 1) { // one entity
      const entity = missingEntities[0];
      this.display(userId, responses, `${entity}_ask`, { entity });
    }
    return missingEntities.length === 0 ? Dialog.STATUS_COMPLETED : Dialog.STATUS_READY;
  }

  /**
   * Executes.
   * @param {string} userId the user id
   * @param {object[]} responses
   * @param {object[]} messageEntities - entities array from user message
   * @param {string} status - the dialog status
   */
  async execute(userId, responses, messageEntities, status) {
    console.log('PromptDialog.execute', userId, responses, messageEntities, status);
    switch (status) {
      case Dialog.STATUS_BLOCKED:
        return this.executeWhenBlocked(userId, responses, messageEntities);
      case Dialog.STATUS_WAITING:
        return this.executeWhenWaiting(userId, responses, messageEntities);
      case Dialog.STATUS_READY:
      default:
        return this.executeWhenReady(userId, responses, messageEntities);
    }
  }

  display(userId, responses, key, parameters) {
    this.pushMessages(
      responses,
      this.viewsManager.resolve(userId, this.name, key, parameters),
    );
  }
}

module.exports = PromptDialog;
