/**
 * Default DialogManager.
 */
class DialogManager {
  /**
   * Constructor.
   */
  constructor(brain, config) {
    // console.log('DialogManager.constructor');
    this.brain = brain;
    this.config = config;
    this.intentThreshold = this.config.intentThreshold || 0.8;
  }

  acceptIntent(value) {
    return (value > this.intentThreshold);
  }

  /**
   * Populates and executes the stack.
   * @param {string} userId the user id
   * @param {string[]} intents the intents
   * @param {Object[]} entities the transient entities
   */
  async execute(userId, intents, entities) {
    console.log('DialogManager.execute', userId, intents, entities);
    const dialogs = [];
    for (const intent of intents) {
      if (this.acceptIntent(intent.value)) {
        dialogs.push({
          label: intent.label,
          parameters: entities
        });
      }
    }
    if (dialogs.length === 0) {
      const lastDialog = await this.brain.userGet(userId, 'lastDialog');
      dialogs.push(lastDialog);
    }
    const responses = [];
    await this.executeDialogs(userId, dialogs, entities, responses);
    return responses;
  }

  /**
   * Executes the dialogs.
   * @param {string} userId the user id
   * @param {Object[]} entities - the entities
   */
  async executeDialogs(userId, dialogs, entities, responses) {
    console.log('DialogManager.executeDialogs', userId, dialogs, entities, responses);
    while (dialogs.length > 0) {
      const dialog = dialogs[dialogs.length - 1];
      await this.brain.userSet(userId, 'lastDialog', dialog);
      console.log('DialogManager.executeDialogs: dialog', dialog);
      const dialogPath = `${this.config.path}/src/controllers/dialogs/${dialog.label}`;
      console.log('DialogManager.executeDialogs: dialogPath', dialogPath);
      const DialogConstructor = require(dialogPath);
      const dialogObject = new DialogConstructor(this.config, this.brain, dialog.parameters);
      const done = await dialogObject.execute(userId, responses, entities);
      if (!done) {
        return;
      }
    }
  }
}

module.exports = DialogManager;
