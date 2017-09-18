const expect = require('expect.js');
const EntityExtraction = require('../../src/entity_extraction');

describe('EntityExtraction', function() {
  it('should apply 2 extractors', async function() {
    const entityExtraction = new EntityExtraction({ path: __dirname });
    const entities = await entityExtraction.compute('sentence');
    expect(entities.length).to.be(2);
    expect(entities[0].dim).to.be('dim1');
    expect(entities[1].dim).to.be('dim2');
  });
});
