class Extractor2 {
  constructor() {
  }

  compute(sentence) {
    return [
      {
        "dim": "dim2",
        "body": sentence,
        "values": [
          {
            "value": sentence,
            "type": "string"
          }
        ]
      }
    ];
  }

}

module.exports = Extractor2;
