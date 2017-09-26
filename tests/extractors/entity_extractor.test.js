/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const EntityExtractor = require('../../src/entity_extractor');

describe('EntityExtractor', function () {
  it('should apply 2 extractors', async function () {
    const entityExtractor = new EntityExtractor({ path: __dirname });
    const entities = await entityExtractor.compute('sentence');
    expect(entities.length).to.be(2);
    expect(entities[0].dim).to.be('dim1');
    expect(entities[1].dim).to.be('dim2');
  });
});
