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
const { Logger, MissingImplementationError } = require('botfuel-dialog');

const logger = Logger('FacetDb');
/**
 * The FacetDb Interface
 */
class FacetDb {
  /**
   * @constructor
   */
  constructor() {
    logger.debug('constructor');
  }

  /**
   * Returns a boolean indicating if the search is done.
   * @param {Object[]} hits - the hits, defaults to the entire db
   * @returns {boolean}
   */
  done() {
    throw new MissingImplementationError();
  }

  /**
   * In the data returned by query, count the number of different value for each facet
   * @param {String[]} facets - an array of facets we want to get the value count
   * @param {Object[]} query - the current query for which we want facet information
   * @returns {Object} - an object mapping each facet to its cardinal
   *
   */
  getFacetValueCardinal(facets, query) {
    throw new MissingImplementationError();
  }

  /**
   * In the data returned by query, for each facet, count the number of row for each value taken by that facet
   * @param {String[]} facets - an array of facets we want to get the value count
   * @param {Object[]} query - the current query for which we want facet information
   * @returns {Object[]} - an object mapping each facet to an array of {value, count}
   *
   */
  getFacetValueCounts(facets, query) {
    throw new MissingImplementationError();
  }

  /**
   * Returns the deduced facets (when facetCount = 0 or 1)
   * @param {String[]} facets - an array of facets
   * @param {Object[]} query - the current query for which we want facet information
   * @returns {String[]} the answered facets.
   */
  getDeducedFacets(facets, query) {
    logger.debug('getDeducedFacets:', facets);
    const facetCardinals = this.getFacetValueCardinal(facets, query);
    return facets.filter(facet => facetCardinals[facet] <= 1);
  }

  /**
   * MinMax strategy to get next question
   * Get the facet which has the minimal possible hits size if query on it.
   * @param {String[]} facets - an array of facets
   * @param {Object[]} hits - the hits, defaults to the entire db
   * @returns {String} the answered facet.
   */

  selectFacetMinMaxStrategy(facets, query) {
    logger.debug('selectFacetMinMaxStrategy', facets);

    const facetValueCounts = this.getFacetValueCounts(facets, query);

    const facetMaxValueCounts = facets.reduce((obj, facet) => {
      obj.push({
        facet,
        maxValueCount: _.maxBy(facetValueCounts[facet], 'count').count,
      });
      return obj;
    }, []);

    return _.minBy(facetMaxValueCounts, 'maxValueCount');
  }
}

module.exports = FacetDb;
