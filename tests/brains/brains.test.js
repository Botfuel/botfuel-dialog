const brainTest = require('./brain_test');

const MONGO_BRAIN_LABEL = 'mongo';
const MEMORY_BRAIN_LABEL = 'memory';

describe('Brains', () => {
  describe('MongoBrain', () => brainTest(MONGO_BRAIN_LABEL));
  describe('MemoryBrain', () => brainTest(MEMORY_BRAIN_LABEL));
});
