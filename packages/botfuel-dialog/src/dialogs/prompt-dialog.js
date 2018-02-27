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

const omit = require('lodash/omit');
const logger = require('logtown')('PromptDialog');
const { filterIntersectingEntities } = require('../utils/entities');
const Dialog = require('./dialog');

/**
 * The prompt dialog prompts the user for a number of entities.
 * The dialog parameters is an Object containing:
 *   - a namespace String representing the name of the dialog
 *   - an entities Object of the form:
 * ```
 *     <entity name>: {
 *         dim: String,
 *         priority: entities parameters will be matched with potential raw entities
 *             in order or priority (highest first)
 *         isFulfilled: Function returning a boolean that determines
 *             when to stop (true) or continue (false)
 *         reducer: Function that determines what to do each time a raw entity
 *             matches with an entity parameter: replace the previously matched entity, append it...
 *     }
 * ```
 * @extends Dialog
 */
class PromptDialog extends Dialog {
  /**
   * @constructor
   * @param {Object} config - the bot config
   * @param {class} brain - the bot brain
   * @param {Object} parameters - the dialog parameters,
   * parameters.entities is a map mapping entities to optional parameters
   */
  constructor(config, brain, parameters) {
    super(config, brain, { reentrant: true }, parameters);
  }

  /**
   * Attempt to match an entity parameter with raw entities candidates extracted from a message.
   * We apply the reducer function to a raw entity candidate until we run out of candidates or
   * if the isFulfilled condition is met.
   * @param {Object} parameter - entity parameter
   * we want to match with one or more raw entities
   * @param {Array<Object>} candidates - array of raw entities extracted
   * from a message: {
   *     dim: String,
   *     body: String,
   *     start: Number,
   *     end: Number,
   *     values: Array<Object>
   * }
   * @param {Object} initialValue - initial value of the entity we want to match
   * @returns {Object} object containing
   * remainingCandidates (candidates minus candidates used) and
   * newValue (value we matched with the parameter)
   */
  matchParameterWithCandidates(parameter, candidates = [], initialValue) {
    const sameDimCandidates = candidates.filter(candidate => candidate.dim === parameter.dim);
    // Check if the parameter is already fulfilled with its initial value
    // If so, we replace the fulfilled parameter’s entity
    // with the first candidate of the same dimension
    const replace = parameter.isFulfilled(initialValue) && sameDimCandidates.length >= 1;
    if (replace) {
      const chosenCandidate = sameDimCandidates[0];
      candidates = filterIntersectingEntities(candidates, chosenCandidate);
      if (Array.isArray(initialValue)) {
        initialValue = [chosenCandidate];
      } else {
        initialValue = chosenCandidate;
      }
    }
    return candidates.filter(candidate => candidate.dim === parameter.dim).reduce(
      ({ newValue, remainingCandidates }, candidate) => {
        if (parameter.isFulfilled(newValue)) {
          return { newValue, remainingCandidates };
        }
        return {
          newValue: parameter.reducer(newValue, candidate),
          remainingCandidates: filterIntersectingEntities(remainingCandidates, candidate),
        };
      },
      { newValue: initialValue, remainingCandidates: candidates },
    );
  }

  /**
   * Updates parameters with default values.
   * @param {Object} parameters - map of entities expected by the dialog: {
   *   <entityName>: {
   *     dim: String,
   *     priority: Number,
   *     isFulfilled: Function()
   *     reducer: Function(),
   *   }
   * }
   * @returns {Object} updated map of entities
   */
  getParameters(parameters) {
    return Object.keys(parameters).reduce((allParameters, name) => {
      const parameter = parameters[name];
      return {
        ...allParameters,
        [name]: {
          dim: parameter.dim,
          // If the reducer function is not defined,
          // we replace the old entities by the new ones
          reducer: parameter.reducer || ((oldEntities, newEntities) => newEntities),
          // If the isFulfilled function is not defined,
          // we check that the entity is not null and not undefined
          isFulfilled: parameter.isFulfilled || (entity => entity != null),
          // Because we need to to be able to override them but we want unfulfilled parameters
          // to have priority over them
          priority: parameter.priority || 0,
        },
      };
    }, {});
  }

  /**
   * Sort expected entities by:
   * - isFulfilled descending (unfulfilled first)
   * - then priority descending (highest priority first)
   * @param {Object} matchedEntities - map of matched entities
   * @param {Object} parameters - map of entities expected by the dialog: {
   *   <entityName>: {
   *     dim: String,
   *     priority: Number,
   *     isFulfilled: Function()
   *     reducer: Function(),
   *   }
   * }
   * @returns {String[]} array of entity names
   */
  getSortedParameterNames(matchedEntities, parameters) {
    return Object.keys(parameters).sort((nameA, nameB) => {
      const parameterA = parameters[nameA];
      const parameterB = parameters[nameB];
      const priorityA = parameterA.priority;
      const priorityB = parameterB.priority;
      const isFulfilledA = parameterA.isFulfilled(matchedEntities[nameA], {
        dialogEntities: matchedEntities,
      })
        ? 0
        : 1;
      const isFulfilledB = parameterB.isFulfilled(matchedEntities[nameB], {
        dialogEntities: matchedEntities,
      })
        ? 0
        : 1;
      if (isFulfilledB !== isFulfilledA) {
        return isFulfilledB - isFulfilledA;
      }
      return priorityB - priorityA;
    });
  }

  /**
   * Computes matched and missing entities.
   * @param {Array.<Object[]>} candidates - array of raw entities given by the extractor.
   * They are candidates for the entity parameters
   * @param {Object} parameters - map of entities expected by the dialog: {
   *   <entityName>: {
   *     dim: String,
   *     priority: Number,
   *     isFulfilled: Function()
   *     reducer: Function(),
   *   }
   * }
   * @param {Object} previouslyMatchedEntities - a map of the entities
   * already matched for this dialog:
   * {
   *   <entityName>: <messageEntity>
   * }
   * @returns {Object} object containing missingEntities and matchedEntities
   */
  computeEntities(candidates, parameters, previouslyMatchedEntities = {}) {
    logger.debug('computeEntities', { candidates, parameters, previouslyMatchedEntities });
    // Setup default values for entities
    parameters = this.getParameters(parameters);
    const result = this.getSortedParameterNames(previouslyMatchedEntities, parameters).reduce(
      ({ matchedEntities, remainingCandidates, missingEntities }, name) => {
        const parameter = parameters[name];
        const initialValue = previouslyMatchedEntities[name];
        const {
          newValue,
          remainingCandidates: newRemainingCandidates,
        } = this.matchParameterWithCandidates(parameter, remainingCandidates, initialValue);
        logger.debug('computeEntities: after matchParameterWithCandidates', {
          newValue,
          newRemainingCandidates,
        });
        const newMatchedEntities = { ...matchedEntities, [name]: newValue };
        const isFulfilled = parameter.isFulfilled(newValue, { dialogEntities: newMatchedEntities });
        // If an entity matching the one we are expecting was found,
        // remove it from missing entities
        // If it was not found, keep missing entities intact
        const newMissingEntities = isFulfilled ? omit(missingEntities, [name]) : missingEntities;
        return {
          matchedEntities: newMatchedEntities,
          remainingCandidates: newRemainingCandidates,
          missingEntities: newMissingEntities,
        };
      },
      {
        matchedEntities: previouslyMatchedEntities,
        remainingCandidates: candidates,
        missingEntities: parameters,
      },
    );
    return { matchedEntities: result.matchedEntities, missingEntities: result.missingEntities };
  }

  /**
   * Executes the dialog.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {Object} userMessage - the user message
   * @param {Object[]} messageEntities - the message entities extracted from the message
   * @returns {Promise.<Object>} an action
   */
  async execute(adapter, userMessage, messageEntities) {
    logger.debug('execute', userMessage, messageEntities);
    const userId = userMessage.user;
    const previouslyMatchedEntities =
      (await this.brain.conversationGet(userId, this.parameters.namespace)) || {};
    logger.debug('execute: previouslyMatchedEntities', previouslyMatchedEntities);
    // Get missing entities and matched entities
    const { missingEntities, matchedEntities } = this.computeEntities(
      messageEntities,
      this.parameters.entities,
      previouslyMatchedEntities,
    );
    logger.debug('execute', { missingEntities, matchedEntities });
    await this.brain.conversationSet(userId, this.parameters.namespace, matchedEntities);
    const extraData = await this.dialogWillDisplay(userMessage, {
      missingEntities,
      matchedEntities,
    });
    const dialogData = { matchedEntities, missingEntities, extraData };
    await this.display(adapter, userMessage, dialogData);
    if (Object.keys(missingEntities).length === 0) {
      const action = await this.dialogWillComplete(userMessage, dialogData);
      return action || this.complete();
    }
    return this.wait();
  }
}

module.exports = PromptDialog;
