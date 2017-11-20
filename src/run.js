#!/usr/bin/env node
require('babel-polyfill');

const path = require('path');
const Bot = require('./bot');

const configPath = path.resolve(process.cwd(), process.argv[2]);

try {
  const config = require(configPath);
  new Bot(config).run();
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    console.log(`Could not load config file ${configPath}`);
    process.exit(1);
  }

  throw e;
}
