const { WsExtractor } = require('botfuel-dialog');

class ColorExtractor extends WsExtractor {}

ColorExtractor.params = {
  dimensions: ['color'],
};

module.exports = ColorExtractor;
