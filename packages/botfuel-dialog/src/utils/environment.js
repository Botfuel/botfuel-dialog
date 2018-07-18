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

const logger = require('logtown')('Environment');
const MissingCredentialsError = require('../errors/missing-credentials-error');

const BOTFUEL_ADAPTER = 'botfuel';
const MONGO_BRAIN = 'mongo';
const BOTFUEL_NLU = 'botfuel';

/**
 * Logs informations/warnings about credentials environment variables.
 * Throws exceptions when required credentials missing
 * @param {Object} config - the bot configuration
 * @returns {void}
 */
const checkCredentials = (config) => {
  const { BOTFUEL_APP_TOKEN, BOTFUEL_APP_ID, BOTFUEL_APP_KEY } = process.env;
  // Botfuel app token
  if (!BOTFUEL_APP_TOKEN) {
    if (config.adapter.name === BOTFUEL_ADAPTER) {
      throw new MissingCredentialsError('BOTFUEL_APP_TOKEN is required to use the Webchat.');
    }
    if (config.brain.name === MONGO_BRAIN) {
      throw new MissingCredentialsError(
        'BOTFUEL_APP_TOKEN is required to use the Brain with mongodb.',
      );
    }
    logger.warn('Environment variable BOTFUEL_APP_TOKEN is not defined.');
  } else {
    logger.info(`BOTFUEL_APP_TOKEN=${BOTFUEL_APP_TOKEN}`);
  }

  // Botfuel app id/key
  if (!BOTFUEL_APP_ID || !BOTFUEL_APP_KEY) {
    if (config.nlu.name === BOTFUEL_NLU) {
      throw new MissingCredentialsError(
        'BOTFUEL_APP_ID and BOTFUEL_APP_KEY are required to use Botfuel NLU.',
      );
    }
  }

  // Botfuel app id
  if (!BOTFUEL_APP_ID) {
    logger.warn('Environment variable BOTFUEL_APP_ID is not defined.');
  } else {
    logger.info(`BOTFUEL_APP_ID=${BOTFUEL_APP_ID}`);
  }

  // Botfuel app key
  if (!BOTFUEL_APP_KEY) {
    logger.warn('Environment variable BOTFUEL_APP_KEY is not defined.');
  } else {
    const keyEndingChars = BOTFUEL_APP_KEY.slice(BOTFUEL_APP_KEY.length - 4);
    const obfuscatedKey = `xxxx${keyEndingChars}`;
    logger.info(`BOTFUEL_APP_KEY=${obfuscatedKey}`);
  }
};

module.exports = { checkCredentials };
