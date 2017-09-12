const EntityExtraction = require('../../src/entity_extraction');
const expect = require('expect.js');

describe('EntityExtraction', () => {
  it('should apply 2 extractors', async () => {
    const entityExtraction = new EntityExtraction({ path: __dirname });
    const entities = await entityExtraction.compute("sentence");
    expect(entities.length).to.be(2);
    expect(entities[0].dim).to.be('dim1');
    expect(entities[1].dim).to.be('dim2');
  });
});
