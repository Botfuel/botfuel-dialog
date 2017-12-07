/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');

const defaultConfig = {
  path: process.cwd(),
  locale: 'en',
  adapter: 'shell',
  brain: 'memory',
  intentThreshold: 0.8,
};

const getConfig = (botConfig) => Object.assign(defaultConfig, botConfig);

/**
* Returns the contents of the bot config file
* @param {String} configFileName - the bot config file name/path
* @returns {Object} the contents of the bot config file
*/
function resolveConfigFile(configFileName) {
  if (!configFileName) {
    console.log('You didn\'t specify any config file, use default config.');
    return {};
  }

  const configPath = path.resolve(process.cwd(), configFileName);

  console.log('config path:', configPath);

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
  getConfig,
};
