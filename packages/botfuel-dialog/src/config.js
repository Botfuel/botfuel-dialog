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
const logger = require('logtown')('Config');
const LoggerManager = require('./logger-manager');

const defaultConfig = {
  path: process.cwd(),
  locale: 'en',
  adapter: 'shell',
  brain: 'memory',
  intentThreshold: 0.8,
  logger: 'dev',
  multiIntent: false,
};

/**
 * Returns the contents of the bot config file
 * @param {String} configFileName - the bot config file name/path
 * @returns {Object} the contents of the bot config file
 */
const resolveConfigFile = (configFileName) => {
  // configure the logger with default configuration first the be able to log errors
  LoggerManager.configure(defaultConfig);

  if (!configFileName) {
    logger.info("You didn't specify any config file, using default config.");
    return {};
  }

  const configPath = path.resolve(process.cwd(), configFileName);

  try {
    return require(configPath);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      logger.error(`Could not load config file ${configPath}`);
      process.exit(1);
    }

    throw error;
  }
};

/**
 * Returns the configuration
 * @param {Object} botConfig - the bot config
 * @returns {Object} the configuration
 */
const getConfiguration = (botConfig) => {
  // get the config by extending defaultConfig with botConfig
  const config = Object.assign(defaultConfig, botConfig);
  // reconfigure the logger with the final config
  LoggerManager.configure(config);
  // return default config extended by bot config
  return config;
};

module.exports = {
  defaultConfig,
  resolveConfigFile,
  getConfiguration,
};
