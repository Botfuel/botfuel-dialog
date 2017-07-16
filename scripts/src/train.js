'use strict';

const EntityExtraction = require('./entity_extraction');
const Fs = require('fs');
const Natural = require('natural');
const { modelName } = require('./config');
const { locale } = require('./config');
const intentSuffix = '.intent';

// TODO: take into accout locale here
let classifier = new Natural.LogisticRegressionClassifier(Natural.PorterStemmerFr);
let intentDirname = `${ __dirname }/intents`;
let modelFilename = `${ __dirname }/../../models/${ modelName }`;
let entityExtraction = new EntityExtraction(locale);

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
        let features = entityExtraction.computeFeaturesSync(line);
        console.log("train:", features, intent);
        classifier.addDocument(features, intent);
      });
  });
classifier.train();
classifier.save(modelFilename);
