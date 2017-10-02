/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const DirectoryEntityExtractor = require('../../src/extractors/directory_entity_extractor');

describe('EntityExtractor', function () {
  it('should apply 2 extractors', async function () {
    const entityExtractor = new DirectoryEntityExtractor(`${__dirname}/src/extractors`);
    const entities = await entityExtractor.compute('sentence');
    expect(entities.length).to.be(2);
    expect(entities[0].dim).to.be('dim1');
    expect(entities[1].dim).to.be('dim2');
  });
});
