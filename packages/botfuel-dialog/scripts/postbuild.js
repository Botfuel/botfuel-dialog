// postbuild script

// use shelljs for cross platform
/* eslint-disable import/no-extraneous-dependencies */
const shell = require('shelljs');

// copy corpora folder
shell.cp('-r', 'src/corpora/*.txt', 'build/corpora/');
shell.echo('postbuild successful');
