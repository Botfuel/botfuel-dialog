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
    // console.log('DM.constructor');
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
    console.log('DM.execute', userId, intents, entities);
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
    console.log('DM.executeDialogs', userId, entities);
    const dialogs = await this.brain.userGet(userId, 'dialogs');
    console.log('DM.executeDialogs: dialogs', dialogs);
    if (dialogs.length > 0) {
      const dialogData = dialogs.pop();
      await this.brain.userSet(userId, 'lastDialog', dialogData);
      console.log('DM.executeDialogs: dialogData', dialogData);
      const dialogPath = `${this.config.path}/src/controllers/dialogs/${dialogData.label}`;
      console.log('DM.executeDialogs: dialogPath', dialogPath);
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
    console.log('DM.next', userId, label, parameters);
    await this.brain.userPush(userId, 'dialogs', { label, parameters });
  }

  /**
   * Says something.
   * @param {string} userId the user id
   * @param {string} label the template label
   * @param {Object} parameters the template parameters
   */
  say(userId, label, parameters) {
    console.log('DM.say', userId, label, parameters);
    const templatePath = `${this.config.path}/src/views/templates/`;
    const templateName = `${templatePath}/${label}.${this.config.locale}.txt`;
    console.log('DM.say: templateName', templateName);
    Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n')
      .forEach((line) => {
        console.log('DM.say: line', line);
        const payload = _.template(line)(parameters);
        console.log('DM.say: payload', payload);
        if (payload !== '') {
          const response = {
            type: 'text',
            userId,
            botId: this.config.id,
            origin: 'bot',
            payload,
          };
          console.log('DM.say: response', response);
          this.responses.push(response);
        }
      });
  }
}

module.exports = DialogManager;
