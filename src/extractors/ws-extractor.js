const _ = require('underscore');
const nlp = require('botfuel-nlp-sdk');
const logger = require('logtown')('WsExtractor');
const Extractor = require('./extractor');

/**
 * Entity extraction web service based extractor.
 */
class WsExtractor extends Extractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    super();
    this.client = new nlp.EntityExtraction({
      appId: process.env.BOTFUEL_APP_ID,
      appKey: process.env.BOTFUEL_APP_KEY,
    });
    this.parameters = parameters;
  }

  // eslint-disable-next-line require-jsdoc
  async compute(sentence) {
    logger.debug('compute', sentence);
    const query = _.clone(this.parameters);
    _.extend(query, { sentence });
    return this.client.compute(query);
  }
}

module.exports = WsExtractor;
