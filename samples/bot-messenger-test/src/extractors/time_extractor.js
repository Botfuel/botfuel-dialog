'use strict';

const nlp = require('botfuel-nlp-sdk');

class TimeExtractor extends nlp.EntityExtraction {
  constructor() {
    super({
      appId: process.env.BOTFUEL_APP_ID,
      appKey: process.env.BOTFUEL_APP_KEY,
    });
  }

  compute(sentence) {
    return super.compute({
      sentence,
      dimensions: ['time'],
      timezone: 'CET',
    });
  }
}

module.exports = TimeExtractor;
