const fs = require('fs');

/**
 * Turns NLU output into a dialog stack.
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

  isUser(label) {
    const path = this.getUserPath(label);
    return fs.existsSync(`${path}.js`);
  }

  getUserPath(label) {
    return `${this.config.path}/src/controllers/dialogs/${label}`;
  }

  getPath(label) {
    if (!this.isUser(label)) {
      return `./dialogs/${label}`;
    }
    return this.getUserPath(label);
  }

  /**
   * Populates and executes the stack.
   * @param {string} userId the user id
   * @param {string[]} intents the intents
   * @param {Object[]} entities the transient entities
   */
  async execute(userId, intents, entities) {
    console.log('DialogManager.execute', userId, intents, entities);
    const dialogs = await this.brain.userGet(userId, 'dialogs');
    for (const intent of intents) {
      if (this.acceptIntent(intent.value)) {
        if (dialogs.length === 0 || dialogs[dialogs.length - 1].label !== intent.label) {
          dialogs.push({ label: intent.label, parameters: entities });
        }
      }
    }
    if (dialogs.length === 0) {
      const lastDialog = await this.brain.userGet(userId, 'lastDialog');
      if (lastDialog !== undefined) {
        dialogs.push(lastDialog);
      } else {
        // no intent detected
        dialogs.push({ label: 'default_dialog' });
      }
    }
    return this.executeDialogs(userId, dialogs, entities);
  }

  /**
   * Executes the dialogs.
   * @param {string} userId the user id
   * @param {Object[]} dialogs - the dialogs
   * @param {Object[]} entities - the entities
   */
  async executeDialogs(userId, dialogs, entities) { // Entities could be replace by parameters
    const responses = [];
    console.log('DialogManager.executeDialogs', userId, dialogs, entities);
    let done = true;
    while (done && dialogs.length > 0) {
      const dialog = dialogs[dialogs.length - 1];
      console.log('DialogManager.executeDialogs: dialog', dialog);
      const user = await this.brain.getUser(userId);
      console.log('DialogManager.executeDialogs', user);
      // eslint-disable-next-line no-await-in-loop
      await this.brain.userSet(userId, 'lastDialog', dialog);
      const path = this.getPath(dialog.label);
      const DialogConstructor = require(path);
      const dialogObject = new DialogConstructor(this.config, this.brain, dialog.parameters);
      // eslint-disable-next-line no-await-in-loop
      done = await dialogObject.execute(userId, responses, entities);
      console.log('DialogManager.executeDialogs: done', done);
      if (done) {
        dialogs = dialogs.slice(0, -1);
      }
    }
    await this.brain.userSet(userId, 'dialogs', dialogs);
    return responses;
  }
}

module.exports = DialogManager;
