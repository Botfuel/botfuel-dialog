module.exports = {
  adapter: { name: 'botfuel' },
  logger: 'custom-logger',
  brain: { name: 'memory' },
  modules: ['botfuel-facetedsearch'],
  path: __dirname,
};
