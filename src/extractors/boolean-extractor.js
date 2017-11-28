/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const FileCorpus = require('../corpora/file-corpus');
const CorpusExtractor = require('./corpus-extractor');

/**
 * Extracts boolean entities.
 * @extends CorpusExtractor
 */
class BooleanExtractor extends CorpusExtractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    parameters.dimension = 'system:boolean';
    parameters.corpus = new FileCorpus(`${__dirname}/../corpora/boolean.${parameters.locale}.txt`);
    super(parameters);
  }

  // eslint-disable-next-line require-jsdoc
  buildValue(value) {
    return { value: value === '1', type: 'boolean' };
  }
}

module.exports = BooleanExtractor;
