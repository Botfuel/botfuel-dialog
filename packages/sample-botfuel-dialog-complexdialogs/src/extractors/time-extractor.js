'use strict';

const { WsExtractor } = require('botfuel-dialog');

class TimeExtractor extends WsExtractor {}

TimeExtractor.params = {
  dimensions: ['time'],
  timezone: 'CET',
};

module.exports = TimeExtractor;
