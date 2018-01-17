'use strict';

const { WsExtractor } = require('botfuel-dialog');

class CityExtractor extends WsExtractor {}

CityExtractor.params = {
  dimensions: ['city', 'location'],
  timezone: 'CET',
};

module.exports = CityExtractor;
