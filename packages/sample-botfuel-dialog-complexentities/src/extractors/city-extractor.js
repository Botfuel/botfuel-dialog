'use strict';

const { WsExtractor } = require('botfuel-dialog');

class CityExtractor extends WsExtractor {}

CityExtractor.params = {
  dimensions: ['city'],
  timezone: 'CET',
};

module.exports = CityExtractor;
