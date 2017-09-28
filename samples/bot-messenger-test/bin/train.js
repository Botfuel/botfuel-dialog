'use strict';
require("babel-polyfill");

const sdk2 = require('@botfuel/bot-sdk2');
const config = require('../shell_config');

new sdk2.Classifier(config).train();
