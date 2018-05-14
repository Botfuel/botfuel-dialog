// prebuild script

// use shelljs for cross platform
/* eslint-disable import/no-extraneous-dependencies */
const shell = require('shelljs');

// remove previous build folder
shell.rm('-rf', 'build');
shell.echo('prebuild successful');
