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
    for (const intent of intents) {
      if (this.acceptIntent(intent.value)) {
        await this.next(userId, intent.label, entities);
      }
    }
    const dialogs = await this.brain.userGet(userId, 'dialogs');
    if (dialogs.length === 0) {
      const lastDialog = await this.brain.userGet(userId, 'lastDialog');
      await this.brain.userPush(userId, 'dialogs', lastDialog);
    }
    const responses = [];
    await this.executeDialogs(userId, entities, responses);
    return responses;
  }

  /**
   * Executes the dialogs.
   * @param {string} userId the user id
   * @param {Object[]} entities - the entities
   */
  async executeDialogs(userId, entities, responses) {
    console.log('DialogManager.executeDialogs', userId, entities, responses);
    const dialogs = await this.brain.userGet(userId, 'dialogs');
    console.log('DialogManager.executeDialogs: dialogs', dialogs);
    if (dialogs.length > 0) {
      const dialogData = dialogs.pop();
      await this.brain.userSet(userId, 'lastDialog', dialogData);
      console.log('DialogManager.executeDialogs: dialogData', dialogData);
      const dialogPath = `${this.config.path}/src/controllers/dialogs/${dialogData.label}`;
      console.log('DialogManager.executeDialogs: dialogPath', dialogPath);
      const DialogConstructor = require(dialogPath);
      const dialog = new DialogConstructor(this.config, this.brain, responses, dialogData.parameters);
      const run = await dialog.execute(userId, entities);
      if (run) { // continue executing the stack
        return this.executeDialogs(userId, entities, responses);
      }
    }
  }
}

module.exports = DialogManager;
