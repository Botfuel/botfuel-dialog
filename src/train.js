#!/usr/bin/env node

require('babel-polyfill');

const configFile = process.argv[2];
const config = require(`${configFile}`);
const Classifier = require('./classifier');

new Classifier(config).train();
