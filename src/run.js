#!/usr/bin/env node
require('babel-polyfill');

const logger = require('logtown')('Bot');
const Bot = require('./bot');
const { resolveConfigFile } = require('./config');

(async () => {
  try {
    const config = resolveConfigFile(process.argv[2]);
    await new Bot(config).run();
  } catch (e) {
    logger.error(e);
  }
})();
