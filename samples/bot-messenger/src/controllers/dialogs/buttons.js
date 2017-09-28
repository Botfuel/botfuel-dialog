const sdk2 = require('@botfuel/bot-sdk2');

/**
 * Buttons class.
 */
class Buttons extends sdk2.Dialog {
  button(text, value) {
    return {
      type: 'postback',
      text,
      value: {
        dialog: { label: 'buttons' },
        entities: [{ dim: 'button', value }],
      },
    };
  }

  /**
   * Executes.
   * @param {string} id the user id
   * @param {Object[]} responses
   * @param {Object} messageEntities
   */
  async execute(id, responses, messageEntities) {
    console.log('Buttons.execute', responses, messageEntities);
    if (messageEntities.length === 0) {
      await this.actionsMessage(id, responses, [
        this.button('text 1', 1),
        this.button('text 2', 2),
      ], { text: 'Voici des boutons!' });
    } else {
      this.textMessage(id, responses, 'button_confirm', messageEntities[0]);
    }
    return true;
  }
}

module.exports = Buttons;
