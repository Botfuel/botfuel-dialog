const sdk2 = require('@botfuel/bot-sdk2');

/**
 * Links class.
 */
class Links extends sdk2.Dialog {
  link(text, value) {
    return {
      type: 'link',
      text,
      value,
    };
  }

  /**
   * Executes.
   * @param {string} id the user id
   * @param {Object[]} responses
   */
  async execute(id, responses) {
    console.log('Links.execute', responses);
    await this.actionsMessage(id, responses, [
      this.link('Botfuel', 'https://www.botfuel.io/'),
      this.link('Google', 'https://www.google.fr/'),
    ], { text: 'Voici des liens!' });
    return true;
  }
}

module.exports = Links;
