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

const fs = require('fs');
const logger = require('logtown')('FileCorpus');
const Corpus = require('./corpus');

/**
 * Class for generating a corpus from a file.
 */
class FileCorpus extends Corpus {
  /**
   * @constructor
   * @param {String} path - the file path
   * @param {String} [separator=','] - the optional row separator
   */
  constructor(path, separator = ',') {
    logger.debug('constructor', path, separator);
    super(
      fs
        .readFileSync(path, 'utf8') // TODO: async?
        .toString()
        .replace(/\r/g, '') // windows introduce \r
        .split('\n')
        .filter(row => row.length > 0)
        .map(row => row.split(separator)),
    );
  }
}

module.exports = FileCorpus;
