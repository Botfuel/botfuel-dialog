#!/usr/bin/env node

require("babel-polyfill");

const configFile = process.argv[2];
const config = require(`${configFile}`);
const Bot = require('./bot');

new Bot(config).run();
