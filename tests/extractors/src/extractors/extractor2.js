class Extractor2 {
  compute(sentence) {
    return [
      {
        dim: 'dim2',
        body: sentence,
        values: [
          {
            value: sentence,
            type: 'string',
          },
        ],
      },
    ];
  }

}

module.exports = Extractor2;
