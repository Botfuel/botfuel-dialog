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
const { Logger, PromptDialog } = require('botfuel-dialog');

const logger = Logger('SearchDialog');
/**
 * @extends PromptDialog
 */
class SearchDialog extends PromptDialog {
  constructor(config, brain, parameters) {
    logger.debug('constructor');
    super(config, brain, parameters);
    this.db = parameters.db;
    this.query = {};
  }

  /**
   * Tranlate matched entities into query to get hits corresponding to matched entities
   * @param {Object} matchedEntities
   */
  buildQueryFromMatchedEntities(matchedEntities) {
    // build query from matched entities
    const query = Object.keys(matchedEntities).reduce((obj, key) => {
      const entity = matchedEntities[key];
      if (
        entity &&
        entity.values.length > 0 &&
        entity.values[0].value !== undefined
      ) {
        return Object.assign({ [key]: entity.values[0].value }, obj);
      }
      return obj;
    }, {});

    return query;
  }

  /**
   * Compute question entities to be sent to the view
   * Missing entities with priority > 0 are put first, then comes the one computed by the strategy
   */
  async computeQuestionEntities(matchedEntities, missingEntities) {
    this.query = this.buildQueryFromMatchedEntities(matchedEntities);
    const facets = Object.keys(missingEntities);
    const deducedFacets = this.db.getDeducedFacets(facets, this.query);
    const reducedMissingEntities = _.omit(missingEntities, deducedFacets);

    if (Object.keys(reducedMissingEntities).length === 0) {
      return new Map();
    }

    const { facet } = this.db.selectFacetMinMaxStrategy(
      Object.keys(reducedMissingEntities),
      this.query,
    );

    // Missing entities with priority > 0 are put first, then comes the one computed by the strategy
    const sortedEntityNames = Object.keys(reducedMissingEntities).sort((a, b) => {
      const entityA = missingEntities[a];
      const entityB = missingEntities[b];

      if (entityA.priority === entityB.priority && facet) {
        if (facet === a) {
          return 0;
        }

        if (facet === b) {
          return 1;
        }
      }

      return entityB.priority - entityA.priority;
    });

    return new Map(sortedEntityNames.map(key => [key, reducedMissingEntities[key]]));
  }

  async dialogWillDisplay(userMessage, { matchedEntities, missingEntities }) {
    logger.debug('dialogWillDisplay');

    if (missingEntities.size === 0) {
      return { data: this.db.getHits(this.query) };
    }
    // return next facet and all the value-counts for that facet
    // search view can show available values as a guide for user
    const facet = missingEntities.keys().next().value;
    return {
      facetValueCounts: this.db.getFacetValueCounts([facet], this.query)[facet],
    };
  }
}

module.exports = SearchDialog;
