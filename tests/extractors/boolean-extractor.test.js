/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const BooleanExtractor = require('../../src/extractors/boolean-extractor');

const extractor = new BooleanExtractor({ locale: 'en' });

describe('BooleanExtractor', function () {
  it('should properly extract', async function () {
    const entities = await extractor.compute('I say yes you say no');
    expect(entities).to.eql([
      {
        dim: 'system:boolean',
        body: 'no',
        values: [
          {
            type: 'boolean',
            value: false,
          },
        ],
        startIndex: 18,
        endIndex: 20,
      },
      {
        dim: 'system:boolean',
        body: 'yes',
        values: [
          {
            type: 'boolean',
            value: true,
          },
        ],
        startIndex: 6,
        endIndex: 9,
      },
    ]);
  });
});
