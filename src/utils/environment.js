const logger = require('logtown')('Environment');
const SdkError = require('../errors/sdk-error');

/**
 * Display environment variables
 * Raise an exception if BOTFUEL_APP_TOKEN is not set
 * @returns {void}
 */
export const checkEnvironmentVariables = () => {
  if (!process.env.BOTFUEL_APP_TOKEN) {
    throw new SdkError('Environment variable BOTFUEL_APP_TOKEN is not defined!');
  } else {
    logger.info('BOTFUEL_APP_TOKEN:', process.env.BOTFUEL_APP_TOKEN);
  }
  if (!process.env.BOTFUEL_APP_ID) {
    logger.warn('Environment variable BOTFUEL_APP_ID is not defined!');
  } else {
    logger.info('BOTFUEL_APP_ID:', process.env.BOTFUEL_APP_ID);
  }
  if (!process.env.BOTFUEL_APP_KEY) {
    logger.warn('Environment variable BOTFUEL_APP_KEY is not defined!');
  } else {
    logger.info('BOTFUEL_APP_KEY:', process.env.BOTFUEL_APP_KEY);
  }
};
