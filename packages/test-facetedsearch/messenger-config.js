module.exports = {
  adapter: { name: 'messenger' },
  logger: 'custom-logger',
  brain: { name: 'memory' },
  modules: ['botfuel-facetedsearch'],
  path: __dirname,
};
