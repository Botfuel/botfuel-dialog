module.exports = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/packages/botfuel-dialog/src/**/*.js',
    '!packages/botfuel-dialog/src/index.js',
    '!packages/botfuel-dialog/src/run.js',
    '!packages/botfuel-dialog/src/clean.js',
  ],
  setupTestFrameworkScriptFile: './setup-jest.js',
  setupFiles: ['./setup-tests.js'],
  verbose: true,
};
