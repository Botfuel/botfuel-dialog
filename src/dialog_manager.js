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
   * @param {string} userId the user id
   * @param {string[]} intents the intents
   * @param {Object[]} entities the transient entities
   */
  async execute(userId, intents, entities) {
    console.log('DialogManager.execute', userId, intents, entities);
    for(const intent of intents) {
      if (this.acceptIntent(intent.value)) {
        await this.next(userId, intent.label, entities);
      }
    }
    const dialogs = await this.brain.userGet(userId, 'dialogs');
    if (dialogs.length === 0) {
      const lastDialog = await this.brain.userGet(userId, 'lastDialog');
      await this.brain.userPush(userId, 'dialogs', lastDialog);
    }
    this.responses = [];
    await this.executeDialogs(userId, entities);
    return this.responses;
  }

  /**
   * Executes the dialogs.
   * @param {string} userId the user id
   * @param {Object[]} entities - the entities
   */
  async executeDialogs(userId, entities) {
    console.log('DialogManager.executeDialogs', userId, entities);
    const dialogs = await this.brain.userGet(userId, 'dialogs');
    console.log('DialogManager.executeDialogs: dialogs', dialogs);
    if (dialogs.length > 0) {
      const dialogData = dialogs.pop();
      await this.brain.userSet(userId, 'lastDialog', dialogData);
      console.log('DialogManager.executeDialogs: dialogData', dialogData);
      const dialogPath = `${this.config.path}/src/controllers/dialogs/${dialogData.label}`;
      console.log('DialogManager.executeDialogs: dialogPath', dialogPath);
      const DialogConstructor = require(dialogPath);
      const dialog = new DialogConstructor(dialogData.parameters);
      const run = await dialog.execute(this, userId, entities);
      if (run) { // continue executing the stack
        return this.executeDialogs(userId, entities);
      }
    }
  }

  /**
   * Pushes a dialog on the stack.
   * @param {string} userId the user id
   * @param {string} label the dialog label
   * @param {Object} parameters the dialog parameters
   */
  async next(userId, label, parameters) {
    console.log('DialogManager.next', userId, label, parameters);
    await this.brain.userPush(userId, 'dialogs', { label, parameters });
  }

  /**
   * Says something.
   * @param {string} userId the user id
   * @param {string} label the template label
   * @param {Object} parameters the template parameters
   */
  say(userId, label, parameters) {
    console.log('DialogManager.say', userId, label, parameters);
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
          const response = {
            type: 'text',
            userId,
            botId: this.config.id,
            origin: 'bot',
            payload
          };
          console.log('DialogManager.say: response', response);
          this.responses.push(response);
        }
      });
  }
}

module.exports = DialogManager;
