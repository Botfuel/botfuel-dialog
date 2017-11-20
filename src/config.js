const path = require('path');

/**
* Returns the contents of the bot config file
* @param {String} configFileName - the bot config file name/path
* @returns {Object} the contents of the bot config file
*/
function resolveConfigFile(configFileName) {
  if (!configFileName) {
    console.log('You must specify a config file: ./node-modules/.bin/botfuel-train config-file.js');
    process.exit(1);
  }

  const configPath = path.resolve(process.cwd(), configFileName);

  try {
    return require(configPath);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log(`Could not load config file ${configPath}`);
      process.exit(1);
    }

    throw error;
  }
}

module.exports = {
  resolveConfigFile,
};
