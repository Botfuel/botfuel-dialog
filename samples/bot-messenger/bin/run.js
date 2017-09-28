'use strict';
require("babel-polyfill");

const sdk2 = require('@botfuel/bot-sdk2');
const configFile = process.argv[2];
const config = require(`../${configFile}`);

new sdk2.Bot(config).run();
