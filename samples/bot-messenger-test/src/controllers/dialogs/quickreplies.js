const sdk2 = require('@botfuel/bot-sdk2');

/**
 * Quick replies class.
 */
class Quickreplies extends sdk2.Dialog {
  /**
   * Executes.
   * @param {string} id the user id
   * @param {Object[]} responses
   * @param {Object} messageEntities
   */
  async execute(id, responses, messageEntities) {
    console.log('Quickreplies.execute', responses, messageEntities);
    await this.quickrepliesMessage(id, responses, [
      'Des liens',
      'Un carousel'
    ], {
      text: 'What next ?'
    });
    return true;
  }
}

module.exports = Quickreplies;
