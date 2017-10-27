const WinstonWrapper = require('logtown-winston');
const winston = require('winston');

const transports = [
  new winston.transports.Console({
    json: false,
    colorize: true,
    prettyPrint: true,
    timestamp: true,
    handleExceptions: true,
    align: false,
    level: 'silly',
  }),
];

const options = { exitOnError: false };

module.exports = {
  wrapper: new WinstonWrapper(transports, options),
};
