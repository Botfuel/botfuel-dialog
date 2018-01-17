'use strict';

const { WsExtractor } = require('botfuel-dialog');

class ForenameExtractor extends WsExtractor {}

ForenameExtractor.params = {
  dimensions: ['forename'],
};

module.exports = ForenameExtractor;
