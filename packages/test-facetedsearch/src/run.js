/* eslint-disable */
require('babel-polyfill');
const { Bot } = require('botfuel-dialog');
const logger = require('logtown')('Bot');
const { resolveConfigFile } = require('botfuel-dialog/build/config');

process.on('unhandledRejection', r => console.log(r)); // eslint-disable-line no-console

(async () => {
  try {
    const config = resolveConfigFile(process.argv[2]);
    await new Bot(config).run();
  } catch (e) {
    logger.error(e);
  }
})();
