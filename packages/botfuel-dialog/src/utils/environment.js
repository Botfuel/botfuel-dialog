const logger = require('logtown')('Environment');
const MissingCredentialsError = require('../errors/missing-credentials-error');

const BOTFUEL_ADAPTER = 'botfuel';
const MONGO_BRAIN = 'mongo';

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
    if (config.adapter === BOTFUEL_ADAPTER) {
      throw new MissingCredentialsError('BOTFUEL_APP_TOKEN is required to use the Webchat.');
    }
    if (config.brain === MONGO_BRAIN) {
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
    if (config.qna) {
      throw new MissingCredentialsError(
        'BOTFUEL_APP_ID and BOTFUEL_APP_KEY are required to use Botfuel QnA.',
      );
    }
    if (config.spellchecking) {
      throw new MissingCredentialsError(
        'BOTFUEL_APP_ID and BOTFUEL_APP_KEY are required to use the spellchecking service.',
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
    logger.info(`BOTFUEL_APP_KEY=${BOTFUEL_APP_KEY}`);
  }
};

module.exports = { checkCredentials };
