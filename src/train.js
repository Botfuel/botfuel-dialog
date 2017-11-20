#!/usr/bin/env node
require('babel-polyfill');

const path = require('path');
const Classifier = require('./classifier');

const configPath = path.resolve(process.cwd(), process.argv[2]);

try {
  const config = require(configPath);
  (async () => {
    await new Classifier(config).train();
    console.log('Traning done.');
  })();
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    console.log(`Could not load config file ${configPath}`);
    process.exit(1);
  }

  throw e;
}
