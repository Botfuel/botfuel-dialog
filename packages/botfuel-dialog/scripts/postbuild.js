// prebuild script

// use shelljs for cross platform
/* eslint-disable import/no-extraneous-dependencies */
const shell = require('shelljs');

// remove previous build folder
shell.cp('-r', 'src/corpora/*.txt', 'build/corpora/');
shell.echo('postbuild successful');
