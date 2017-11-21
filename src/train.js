#!/usr/bin/env node
require('babel-polyfill');

const logger = require('logtown')('Train');
const Classifier = require('./classifier');
const { resolveConfigFile } = require('./config');

const config = resolveConfigFile(process.argv[2]);
(async () => {
  try {
    await new Classifier(config).train();
    logger.info('Training done.');
  } catch (e) {
    logger.error(e);
  }
})();
