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
const { filterIntersectingEntities, getEntityInitialValue } = require('../utils/entities');
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
   * @param {Object} parameter - entity parameter we want to match with one or more raw entities
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
  matchParameterWithCandidates({ dialogParameter, candidates, initialValue }) {
    const sameDimCandidates = candidates.filter(candidate => candidate.dim === dialogParameter.dim);
    // Check if the parameter is already fulfilled with its initial value
    // If so, we replace the fulfilled parameter’s entity
    // with the first candidate of the same dimension
    const replaceFulfilledEntity =
      dialogParameter.isFulfilled(initialValue) && sameDimCandidates.length >= 1;
    const chosenCandidate = sameDimCandidates[0];

    return (replaceFulfilledEntity
      ? filterIntersectingEntities(candidates, chosenCandidate)
      : candidates
    )
      .filter(candidate => candidate.dim === dialogParameter.dim)
      .reduce(
        ({ newValue, remainingCandidates }, candidate) => {
          if (dialogParameter.isFulfilled(newValue)) {
            return { remainingCandidates, newValue };
          }
          const reducedValue = dialogParameter.reducer(newValue, candidate);
          return {
            remainingCandidates: filterIntersectingEntities(remainingCandidates, candidate),
            newValue: reducedValue === undefined ? null : reducedValue,
          };
        },
        {
          remainingCandidates: replaceFulfilledEntity
            ? filterIntersectingEntities(candidates, chosenCandidate)
            : candidates,
          newValue: replaceFulfilledEntity
            ? getEntityInitialValue(initialValue)(chosenCandidate)
            : initialValue,
        },
      );
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
   * @param {Object} dialogEntities - a map of the entities already matched for this dialog: {
   *   <entityName>: <messageEntity>
   * }
   * @returns {Object} object containing missingEntities and matchedEntities
   * (same structure as dialogEntities)
   */
  computeEntities(candidates, parameters, dialogEntities = {}) {
    logger.debug('computeEntities', { candidates, parameters, dialogEntities });
    // Setup default values for entities
    const dialogParameters = Object.keys(parameters).reduce((allEntities, name) => {
      const dialogParameter = parameters[name];
      return {
        ...allEntities,
        [name]: {
          dim: dialogParameter.dim,
          // If the reducer function is not defined,
          // we replace the old entities by the new ones
          reducer: dialogParameter.reducer || ((oldEntities, newEntities) => newEntities),
          // If the isFulfilled function is not defined,
          // we check that the entity is not null and not undefined
          isFulfilled: dialogParameter.isFulfilled || (entity => entity != null),
          // Because we need to to be able to override them but we want unfulfilled parameters
          // to have priority over them
          priority: dialogParameter.priority || 0,
        },
      };
    }, {});
    const result = Object.keys(dialogParameters)
      // Sort expected entities by:
      // - isFulfilled descending (unfulfilled first)
      // - then priority descending (highest priority first)
      .sort((nameA, nameB) => {
        const dialogParameterA = dialogParameters[nameA];
        const dialogParameterB = dialogParameters[nameB];
        const priorityA = dialogParameterA.priority;
        const priorityB = dialogParameterB.priority;
        const isFulfilledA = dialogParameterA.isFulfilled(dialogEntities[nameA], { dialogEntities })
          ? 0
          : 1;
        const isFulfilledB = dialogParameterB.isFulfilled(dialogEntities[nameB], { dialogEntities })
          ? 0
          : 1;
        if (isFulfilledB !== isFulfilledA) {
          return isFulfilledB - isFulfilledA;
        }
        return priorityB - priorityA;
      })
      .reduce(
        ({ matchedEntities, remainingCandidates, missingEntities }, name) => {
          const dialogParameter = dialogParameters[name];
          const {
            newValue,
            remainingCandidates: newRemainingCandidates,
          } = this.matchParameterWithCandidates({
            dialogParameter,
            candidates: remainingCandidates,
            initialValue: dialogEntities[name],
          });
          logger.debug('computeEntities: after matchParameterWithCandidates', {
            newValue,
            remainingCandidates,
          });
          const isFulfilled = dialogParameter.isFulfilled(newValue, { dialogEntities });
          return {
            // Store the found entities here as a { <entityName>: <entity> } map
            matchedEntities: { ...matchedEntities, [name]: newValue },
            remainingCandidates: newRemainingCandidates,
            // If an entity matching the one we are expecting was found,
            // remove it from missing entities
            // If it was not found, keep missing entities intact
            missingEntities: isFulfilled ? omit(missingEntities, [name]) : missingEntities,
          };
        },
        {
          matchedEntities: dialogEntities,
          remainingCandidates: candidates,
          missingEntities: dialogParameters,
        },
      );
    return { matchedEntities: result.matchedEntities, missingEntities: result.missingEntities };
  }

  /**
   * Executes the dialog.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} candidates - the message entities extracted from the message
   * @returns {Promise.<Object>} an action
   */
  async execute(adapter, userId, candidates) {
    logger.debug('execute', userId, candidates);
    const dialogEntities =
      (await this.brain.conversationGet(userId, this.parameters.namespace)) || {};
    logger.debug('execute: dialogEntities', dialogEntities);
    // Get missing entities and matched entities
    const { missingEntities, matchedEntities } = this.computeEntities(
      candidates,
      this.parameters.entities,
      dialogEntities,
    );
    logger.debug('execute', { missingEntities, matchedEntities });
    await this.brain.conversationSet(userId, this.parameters.namespace, matchedEntities);
    const dialogData = await this.dialogWillDisplay(userId, {
      missingEntities,
      matchedEntities,
    });
    await this.display(adapter, userId, { matchedEntities, missingEntities, dialogData });
    if (Object.keys(missingEntities).length === 0) {
      const result = await this.dialogWillComplete(userId, {
        matchedEntities,
        missingEntities,
      });
      return result || this.complete();
    }
    return this.wait();
  }
}

module.exports = PromptDialog;
