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

const _ = require('lodash');
const { Logger } = require('botfuel-dialog');
const FacetDb = require('./facet-db');

const logger = Logger('PlainFacetDb');
/**
 * The in memory PlainFacetDb for faceted search
 */
class PlainFacetDb extends FacetDb {
  /**
   * @constructor
   * @param {Object[]} data - the rows
   * @param {Object} metadata - object providing the filter function, the done condition
   * metadata = {
   *  filter: (query, row) => boolean
   *  done: (query) => boolean
   * }
   */
  constructor(data, metadata) {
    super();

    logger.debug('constructor');
    this.data = data;
    this.metadata = metadata; // filter, done
  }

  static EQUAL(value, param) {
    return value === param;
  }
  static IN(value, param) {
    return param && param.includes(value);
  }
  static BETWEEN(value, param) {
    return param && value >= param[0] && value <= param[1];
  }

  static DEFAULTFILTER(facetFilters) {
    return (query, row) => {
      let result = true;
      _.forEach(Object.keys(query), (key) => {
        if (!facetFilters[key](query[key], row[key])) {
          result = false;
          return false;
        }
        return true;
      });

      return result;
    };
  }

  /**
   * Returns the hits (rows) corresponding to a query.
   * @param {Object} query - an object mapping facet names to values
   * @returns {Object[]} the hits
   */
  getHits(query = {}) {
    logger.debug('getHits', query);

    if (query === undefined || query === {}) {
      return this.data;
    }

    return this.data.filter(row => this.metadata.filter(query, row));
  }

  /**
   * Returns a boolean indicating if the search is done.
   * @param {Object[]} hits - the hits, defaults to the entire db
   * @returns {boolean}
   */
  done(query = {}) {
    logger.debug('done', query);
    const hits = this.getHits(query);
    return this.metadata.done(hits);
  }

  /** @inheritdoc */
  getFacetValueCardinal(facets, query) {
    logger.debug('getFacetValueCardinal', facets);
    const hits = this.getHits(query);

    const result = facets.reduce((obj, facet) => {
      const values = _.without(_.uniq(hits.map(row => row[facet])), undefined);
      return Object.assign({ [facet]: values.length }, obj);
    }, {});

    logger.debug('getFacetValueCardinal', result);
    return result;
  }

  /** @inheritdoc */
  getFacetValueCounts(facets, query) {
    logger.debug('getFacetValueCounts', facets);
    const hits = this.getHits(query);

    // normalization for array value type with IN critera
    // example: size = [S,M,L] ==> denormalization will return 3 hits

    const result = facets.reduce((map, facet) => {
      const valueHits = _.groupBy(hits, row => row[facet]);

      const valueCounts = Object.keys(valueHits).reduce((arr, value) => {
        arr.push({ value, count: valueHits[value].length });
        return arr;
      }, []);
      return Object.assign({ [facet]: valueCounts }, map);
    }, {});

    logger.debug('getFacetValueCounts:', result);
    return result;
  }
}

module.exports = PlainFacetDb;
