'use strict';

const Nlu = require('./nlu');
const Fs = require('fs');
const Natural = require('natural');
const { modelName } = require('./config');
const { locale } = require('./config');
const intentSuffix = '.intent';

// TODO: take into accout locale here
let classifier = new Natural.LogisticRegressionClassifier(Natural.PorterStemmerFr);
let intentDirname = `${ __dirname }/intents`;
let modelFilename = `${ __dirname }/../../models/${ modelName }`;
let nlu = new Nlu(locale);

Fs
    .readdirSync(intentDirname, "utf8")
    .filter((fileName) => {
        return fileName.substr(-intentSuffix.length) === intentSuffix;
    })
    .map((fileName) => {
        let intent = fileName.substring(0, fileName.length - intentSuffix.length);
        Fs
            .readFileSync(`${ intentDirname }/${ fileName }`, "utf8")
            .toString()
            .split("\n")
            .map((line) => {
                classifier.addDocument(nlu.computeFeatures(line), intent);
            });
    });
classifier.train();
classifier.save(modelFilename);
