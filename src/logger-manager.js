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

const fs = require('fs-extra');
const Logger = require('logtown');
const LoggerError = require('./errors/logger-error');

/**
 * Configure the logger facade
 */
class LoggerManager {
  /**
   * Configures the logger wrapper and configuration
   * @param {Object} config - the bot configuration
   * @returns {void}
   */
  static configure(config) {
    const [loggerPath] = [
      `${config.path}/src/loggers/${config.logger}.js`,
      `${__dirname}/loggers/${config.logger}.js`,
    ].filter(path => fs.pathExistsSync(path));

    if (!loggerPath) {
      throw new LoggerError({ message: `Logger ${config.logger} not found!` });
    }

    const loggerConfig = require(loggerPath);

    if (loggerConfig.wrapper) {
      // clean wrappers
      Logger.clean();
      Logger.addWrapper(loggerConfig.wrapper);
    }

    if (loggerConfig.config) {
      Logger.configure(loggerConfig.config);
    }
  }
}

module.exports = LoggerManager;
