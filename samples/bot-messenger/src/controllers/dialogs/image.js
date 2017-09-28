const sdk2 = require('@botfuel/bot-sdk2');

/**
 * Image class.
 */
class Image extends sdk2.Dialog {
  /**
   * Executes.
   * @param {string} id the user id
   * @param {Object[]} responses
   * @param {Object} messageEntities
   */
  async execute(id, responses, messageEntities) {
    console.log('Image.execute', responses, messageEntities);
    await this.imageMessage(
      id,
      responses,
      'https://d3evv04q39b0w5.cloudfront.net/prod/app/pages/home/images/chatbot-person.png',
    );
    return true;
  }
}

module.exports = Image;
