'use strict';

const Fs = require('fs');
const Natural = require('natural');
const Features = require('./features');

const intentSuffix = '.intent';

class Train {
  constructor(config, path) {
    console.log('Train.constructor', config, path);
    this.config = config;
    this.path = path;
    this.classifier = new Natural.LogisticRegressionClassifier(Natural.PorterStemmerFr);
    this.modelFilename = `${path}/models/${config.modelName}`;
    this.intentDirname = `${path}/scripts/src/data/intents`;
    this.features = new Features(config.locale);
  }

  run() {
    console.log('Train.run');
    Fs
      .readdirSync(this.intentDirname, 'utf8')
      .filter(fileName => fileName.substr(-intentSuffix.length) === intentSuffix)
      .map((fileName) => {
        console.log('train:', fileName);
        const intent = fileName.substring(0, fileName.length - intentSuffix.length);
        console.log('train:', intent);
        return Fs
          .readFileSync(`${this.intentDirname}/${fileName}`, 'utf8')
          .toString()
          .split('\n')
          .map((line) => {
            console.log('train:', line);
            const feats = this.features.computeSync(line, null);
            console.log('train:', feats, intent);
            return this.classifier.addDocument(feats, intent);
          });
      });
    this.classifier.train();
    this.classifier.save(this.modelFilename);
  }
}

module.exports = Train;
