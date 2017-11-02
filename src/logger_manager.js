const fs = require('fs');
const Logger = require('logtown');

class LoggerManager {
  static configure(config) {
    const paths = [
      `${config.path}/src/loggers/${config.logger}.js`,
      `${__dirname}/loggers/${config.logger}.js`,
    ];
    for (const path of paths) {
      if (fs.existsSync(path)) {
        const logger = require(path);
        if (logger.wrapper) {
          // clean wrappers
          Logger.clean();
          Logger.addWrapper(logger.wrapper);
        }
        if (logger.config) {
          Logger.configure(logger.config);
        }
        break;
      }
    }
  }
}

module.exports = LoggerManager;
