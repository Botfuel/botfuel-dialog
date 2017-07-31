'use strict';

const NLP = require('botfuel-nlp-sdk')

class EntityExtraction {
  parse(sentence) {
    console.log("EntityExtraction.parse", sentence);
    return new NLP.EntityExtraction({
      appId: process.env.BOTFUEL_APP_ID,
      appKey: process.env.BOTFUEL_APP_KEY
    })
      .compute({
        sentence: sentence,
        dimensions: ['time', 'city'],
        locale: 'fr',
        timezone: 'CET',
    })
      .then((response) => {
        return Promise.resolve(JSON.parse(response));
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}

module.exports = EntityExtraction
