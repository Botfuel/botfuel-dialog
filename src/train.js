'use strict';

const Fs = require('fs');
const Natural = require('natural');
const Features = require('./features');
const intentSuffix = '.intent';

class Train {
  constructor(config, path) {
    console.log("Train.constructor", config, path);
    this.config = config;
    this.path = path;
    this.classifier = new Natural.LogisticRegressionClassifier(Natural.PorterStemmerFr);
    this.modelFilename = `${ path }/models/${ config.modelName }`;
    this.intentDirname = `${ path }/scripts/src/data/intents`;
    this.features = new Features(config.locale);
  }

  run() {
    console.log("Train.run");
    Fs
      .readdirSync(this.intentDirname, "utf8")
      .filter((fileName) => {
        return fileName.substr(-intentSuffix.length) === intentSuffix;
      })
      .map((fileName) => {
        console.log("train:", fileName);
        let intent = fileName.substring(0, fileName.length - intentSuffix.length);
        console.log("train:", intent);
        Fs
          .readFileSync(`${ this.intentDirname }/${ fileName }`, "utf8")
          .toString()
          .split("\n")
          .map((line) => {
            console.log("train:", line);
            let feats = this.features.computeSync(line, null);
            console.log("train:", feats, intent);
            this.classifier.addDocument(feats, intent);
          });
      });
    this.classifier.train();
    this.classifier.save(this.modelFilename);
  }
}

module.exports = Train;
