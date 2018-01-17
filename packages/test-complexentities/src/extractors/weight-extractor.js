'use strict';

const { WsExtractor } = require('botfuel-dialog');

class WeightExtractor extends WsExtractor {}

WeightExtractor.params = {
  dimensions: ['weight'],
};

module.exports = WeightExtractor;
