const DialogManager = require('../src/dialog_manager.js');

test('say', () => {
  const dm = new DialogManager(null, { locale: 'fr' });
  expect(dm.say(0, 'entity_ask', { entity: 'foo' }, [], './src/templates')).toBeUndefined();
});
