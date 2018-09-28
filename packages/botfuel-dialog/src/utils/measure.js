const convertHrtime = require('convert-hrtime');

const measureTime = logger => label => async (functionToMeasure) => {
  const start = process.hrtime();
  const functionResult = await functionToMeasure();
  const end = process.hrtime(start);

  logger.info(`[${label}] ${convertHrtime(end).milliseconds.toFixed(1)} ms`);
  return functionResult;
};

module.exports = measureTime;
