module.exports = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['**/packages/botfuel-dialog/src/**/*.js'],
  setupTestFrameworkScriptFile: './setup-jest.js',
  setupFiles: ['./setup-tests.js'],
  verbose: true,
};
