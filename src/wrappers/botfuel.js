const botfuelLoggerWrapper = (id, level, stats, ...rest) => {
  console.log(`${level} [${id}]`, ...rest);
};

module.exports = botfuelLoggerWrapper;
