'use strict';

const Fs = require('fs');
const Natural = require('natural');
const Features = require('./features');
const { modelName, locale } = require('./../../config');
const intentSuffix = '.intent';

// TODO: take into accout locale here
let classifier = new Natural.LogisticRegressionClassifier(Natural.PorterStemmerFr);
let intentDirname = `${ __dirname }/../data/intents`;
let modelFilename = `${ __dirname }/../../../../models/${ modelName }`;
let features = new Features(locale);

Fs
  .readdirSync(intentDirname, "utf8")
  .filter((fileName) => {
    return fileName.substr(-intentSuffix.length) === intentSuffix;
  })
  .map((fileName) => {
    console.log("train:", fileName);
    let intent = fileName.substring(0, fileName.length - intentSuffix.length);
    console.log("train:", intent);
    Fs
      .readFileSync(`${ intentDirname }/${ fileName }`, "utf8")
      .toString()
      .split("\n")
      .map((line) => {
        console.log("train:", line);
        let feats = features.computeSync(line, null);
        console.log("train:", feats, intent);
        classifier.addDocument(feats, intent);
      });
  });
classifier.train();
classifier.save(modelFilename);
