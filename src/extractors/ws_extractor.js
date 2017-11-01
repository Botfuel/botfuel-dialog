const _ = require('underscore');
const nlp = require('botfuel-nlp-sdk');
const logger = require('logtown')('WsExtractor');

/**
 * Extract web service entities
 */
class WsExtractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    this.client = new nlp.EntityExtraction({
      appId: process.env.BOTFUEL_APP_ID,
      appKey: process.env.BOTFUEL_APP_KEY,
    });
    this.parameters = parameters;
  }

  /**
   * Compute entities from a sentence
   * @async
   * @param {String} sentence - the sentence
   * @returns {Promise.<Object[]>} the entities
   */
  async compute(sentence) {
    logger.debug('compute', sentence);
    const query = _.clone(this.parameters);
    _.extend(query, { sentence });
    return this.client.compute(query);
  }
}

module.exports = WsExtractor;
