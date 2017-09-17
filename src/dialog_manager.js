const fs = require('fs');

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

  getPath(label) {
    console.log('DialogManager.getPath', label);
    const path = `${this.config.path}/src/controllers/dialogs/${label}`;
    if (fs.existsSync(`${path}.js`)) {
      return path;
    } else {
      return `./dialogs/${label}`;
    }
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
        const path = getPath(intent.label);
        dialogs.push({ path, parameters: entities });
      }
    }
    if (dialogs.length === 0) {
      const lastDialog = await this.brain.userGet(userId, 'lastDialog');
      if (lastDialog !== undefined) {
        dialogs.push(lastDialog);
      } else {
        // no intent detected
        // TODO: handle this
      }
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
      console.log('DialogManager.executeDialogs: dialog', dialog);
      await this.brain.userSet(userId, 'lastDialog', dialog);
      const DialogConstructor = require(dialog.path);
      const dialogObject = new DialogConstructor(this.config, this.brain, dialog.parameters);
      const done = await dialogObject.execute(userId, responses, entities);
      console.log('DialogManager.executeDialogs: done', done);
      if (done) {
        await this.brain.userSet(userId, 'dialogs', dialogs.slice(0, -1));
      } else {
        return;
      }
    }
  }
}

module.exports = DialogManager;
