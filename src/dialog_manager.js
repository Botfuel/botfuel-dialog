const Fs = require('fs');
const _ = require('underscore');

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

/**
 * Default DialogManager.
 */
class DialogManager {
  /**
   * Constructor.
   */
  constructor(brain, config) {
    console.log('DialogManager.constructor');
    this.brain = brain;
    this.config = config;
    this.intentThreshold = this.config.intentThreshold || 0.8;
  }

  acceptIntent(value) {
    return (value > this.intentThreshold);
  }

  /**
   * Populates and executes the stack.
   * @param {string} id the user id
   * @param {string[]} intents the intents
   * @param {Object[]} entities the transient entities
   */
  async execute(id, intents, entities) {
    console.log('DialogManager.execute', id, intents, entities);
    for(const intent of intents) {
      if (this.acceptIntent(intent.value)) {
        await this.next(id, intent.label);
      }
    }
    const dialogs = await this.brain.userGet(id, 'dialogs');
    if (dialogs.length === 0) {
      const lastDialog = await this.brain.userGet(id, 'lastDialog');
      await this.brain.userPush(id, 'dialogs', lastDialog);
    }
    this.responses = [];
    await this.executeDialogs(id, entities);
    return this.responses;
  }

  /**
   * Executes the dialogs.
   * @param {string} id the user id
   * @param {Object[]} entities - the entities
   */
  async executeDialogs(id, entities) {
    console.log('DialogManager.executeDialogs', id, entities);
    const dialogs = await this.brain.userGet(id, 'dialogs');
    console.log('DialogManager.executeDialogs', dialogs);
    if (dialogs.length > 0) {
      const dialogData = dialogs.pop();
      await this.brain.userSet(id, 'lastDialog', dialogData);
      console.log('DialogManager.executeDialogs', dialogData);
      const Dialog = require(`${this.config.path}/src/controllers/dialogs/${dialogData.label}`);
      const run = await new Dialog(dialogData.parameters).execute(this, id, entities);
      if (run) { // continue executing the stack
        return this.executeDialogs(id, entities);
      }
    }
  }

  /**
   * Pushes a dialog on the stack.
   * @param {string} id the user id
   * @param {string} label the dialog label
   * @param {Object} parameters the dialog parameters
   */
  async next(id, label, parameters) {
    console.log('DialogManager.next', id, label, parameters);
    await this.brain.userPush(id, 'dialogs', { label, parameters });
  }

  /**
   * Says something.
   * @param {string} id the user id
   * @param {string} label the template label
   * @param {Object} parameters the template parameters
   */
  say(id, label, parameters) {
    console.log('DialogManager.say', label, parameters);
    const templatePath = `${this.config.path}/src/views/templates/`;
    const templateName = `${templatePath}/${label}.${this.config.locale}.txt`;
    console.log('DialogManager.say: templateName', templateName);
    Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n')
      .forEach((line) => {
        console.log('DialogManager.say: line', line);
        const payload = _.template(line)(parameters);
        console.log('DialogManager.say: payload', payload);
        if (payload !== '') {
          const response = { type: 'text', id, payload };
          console.log('DialogManager.say: response', response);
          this.responses.push(response);
        }
      });
  }
}

module.exports = DialogManager;
