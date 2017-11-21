/* eslint-disable prefer-arrow-callback */

const brainTest = require('./brain-test');

const MONGO_BRAIN_LABEL = 'mongo';
const MEMORY_BRAIN_LABEL = 'memory';

describe('Brains', () => {
  describe('MongoBrain', function () { brainTest(MONGO_BRAIN_LABEL); });
  describe('MemoryBrain', function () { brainTest(MEMORY_BRAIN_LABEL); });
});
