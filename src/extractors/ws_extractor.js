const _ = require('underscore');
const nlp = require('botfuel-nlp-sdk');

/**
 * Class for extracting entities.
 */
class WsExtractor {
  /**
   * Constructor.
   */
  constructor(options) {
    // console.log('WsExtractor.constructor', options);
    this.client = new nlp.EntityExtraction({
      appId: process.env.BOTFUEL_APP_ID,
      appKey: process.env.BOTFUEL_APP_KEY,
    });
    this.options = options;
  }

  /**
   * @param {string} sentence the sentence
   */
  async compute(sentence) {
    // console.log('WsExtractor.compute', sentence);
    const query = _.clone(this.options);
    _.extend(query, { sentence });
    return this.client.compute(query);
  }
}

module.exports = WsExtractor;
