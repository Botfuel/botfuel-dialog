// clean script

// use shelljs for cross platform
/* eslint-disable import/no-extraneous-dependencies */
const shell = require('shelljs');

// remove node_modules
shell.rm('-rf', 'node_modules');
shell.echo('clean successful');
