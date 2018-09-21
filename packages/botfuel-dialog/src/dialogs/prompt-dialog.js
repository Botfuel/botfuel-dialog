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
   * @param {class} bot - the bot
   * @param {Object} parameters - the dialog parameters,
   * parameters.entities is a map mapping entities to optional parameters
   */
  constructor(bot, parameters) {
    super(bot, { reentrant: true }, parameters);
  }

  /**
   * Attempt to match an entity parameter with raw entities candidates extracted from a message.
   * We apply the reducer function to a raw entity candidate until we run out of candidates or
   * if the isFulfilled condition is met.
   * @param {Object} entity - entity parameter
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
  matchEntityWithCandidates(entity, candidates = [], initialValue) {
    logger.debug('matchEntityWithCandidates', { entity, candidates, initialValue });
    const sameDimCandidates = candidates.filter(candidate => candidate.dim === entity.dim);
    // Check if the parameter is already fulfilled with its initial value
    // If so, we replace the fulfilled parameter’s entity
    // with the first candidate of the same dimension
    const replace = entity.isFulfilled(initialValue, {
      dialogEntities: {},
      dialogParameters: this.parameters,
    }) && sameDimCandidates.length >= 1;
    if (replace) {
      const chosenCandidate = sameDimCandidates[0];
      candidates = filterIntersectingEntities(candidates, chosenCandidate);
      if (Array.isArray(initialValue)) {
        initialValue = [chosenCandidate];
      } else {
        initialValue = chosenCandidate;
      }
    }
    return candidates.filter(candidate => candidate.dim === entity.dim).reduce(
      ({ newValue, remainingCandidates }, candidate) => {
        if (entity.isFulfilled(newValue, {
          dialogEntities: {},
          dialogParameters: this.parameters,
        })) {
          return { newValue, remainingCandidates };
        }
        return {
          newValue: entity.reducer(newValue, candidate),
          remainingCandidates: filterIntersectingEntities(remainingCandidates, candidate),
        };
      },
      { newValue: initialValue, remainingCandidates: candidates },
    );
  }

  /**
   * Update entities with default values.
   * @param {Object} entities - map of entities expected by the dialog: {
   *   <entityName>: {
   *     dim: String,
   *     priority: Number,
   *     isFulfilled: Function()
   *     reducer: Function(),
   *   }
   * }
   * @returns {Object} updated map of entities
   */
  updateEntityWithDefaultValues(entities) {
    logger.debug('updateEntityWithDefaultValues', { entities });
    return Object.keys(entities).reduce((allEntities, name) => {
      const entity = entities[name];
      return {
        ...allEntities,
        [name]: {
          dim: entity.dim,
          // If the reducer function is not defined,
          // we replace the old entities by the new ones
          reducer: entity.reducer || ((oldEntities, newEntities) => newEntities),
          // If the isFulfilled function is not defined,
          // we check that the entity is not null and not undefined
          isFulfilled: entity.isFulfilled || (e => e != null),
          // Because we need to to be able to override them but we want unfulfilled parameters
          // to have priority over them
          priority: entity.priority || 0,
        },
      };
    }, {});
  }

  /**
   * Sort expected entities by:
   * - isFulfilled descending (unfulfilled first)
   * - then priority descending (highest priority first)
   * @param {Object} matchedEntities - map of matched entities
   * @param {Object} expectedEntities - map of entities expected by the dialog: {
   *   <entityName>: {
   *     dim: String,
   *     priority: Number,
   *     isFulfilled: Function()
   *     reducer: Function(),
   *   }
   * }
   * @param {String} previousQuestionEntity - previous question entity
   * @returns {String[]} array of entity names
   */
  getSortedEntities(matchedEntities, expectedEntities, previousQuestionEntity) {
    logger.debug('getSortedEntities', { matchedEntities, expectedEntities, previousQuestionEntity });
    return Object.keys(expectedEntities).sort((nameA, nameB) => {
      const entityA = expectedEntities[nameA];
      const entityB = expectedEntities[nameB];
      const priorityA = entityA.priority;
      const priorityB = entityB.priority;
      const isFulfilledA = entityA.isFulfilled(matchedEntities[nameA], {
        dialogEntities: matchedEntities,
        dialogParameters: this.parameters,
      })
        ? 0
        : 1;
      const isFulfilledB = entityB.isFulfilled(matchedEntities[nameB], {
        dialogEntities: matchedEntities,
        dialogParameters: this.parameters,
      })
        ? 0
        : 1;
      if (isFulfilledB !== isFulfilledA) {
        return isFulfilledB - isFulfilledA;
      }

      if (priorityA === priorityB && previousQuestionEntity) {
        if (previousQuestionEntity === nameA) {
          return 0;
        }

        if (previousQuestionEntity === nameB) {
          return 1;
        }
      }

      return priorityB - priorityA;
    });
  }

  /**
   * Computes matched and missing entities.
   * @param {Array.<Object[]>} candidates - array of raw entities given by the extractor.
   * They are candidates for the entity parameters
   * @param {Object} dialogEntities - map of entities expected by the dialog: {
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
   * @param {String} previousQuestionEntity - previous question entity
   * @returns {Object} object containing missingEntities and matchedEntities
   */
  async computeEntities(
    candidates,
    dialogEntities,
    previouslyMatchedEntities = {},
    previousQuestionEntity = undefined,
  ) {
    logger.debug('computeEntities', {
      candidates,
      dialogEntities,
      previouslyMatchedEntities,
      previousQuestionEntity,
    });

    // Setup default values for entities
    dialogEntities = this.updateEntityWithDefaultValues(dialogEntities);

    const sortedDialogEntityNames = this.getSortedEntities(
      previouslyMatchedEntities,
      dialogEntities,
      previousQuestionEntity,
    );

    let missingEntities = dialogEntities;
    let matchedEntities = previouslyMatchedEntities;
    let remainingCandidates = candidates;

    for (const name of sortedDialogEntityNames) {
      const entity = dialogEntities[name];
      const initialValue = previouslyMatchedEntities[name];
      const {
        newValue,
        remainingCandidates: newRemainingCandidates,
      } = this.matchEntityWithCandidates(entity, remainingCandidates, initialValue);
      logger.debug('computeEntities: after matchParameterWithCandidates', {
        name,
        newValue,
        newRemainingCandidates,
      });

      remainingCandidates = newRemainingCandidates;

      if (newValue) {
        matchedEntities = { ...matchedEntities, [name]: newValue };
      }

      const isFulfilled = entity.isFulfilled(newValue, {
        dialogEntities: matchedEntities,
        dialogParameters: this.parameters,
      });

      // If an entity matching the one we are expecting was found,
      // remove it from missing entities
      // If it was not found, keep missing entities intact
      missingEntities = isFulfilled ? _.omit(missingEntities, [name]) : missingEntities;
    }

    // transform missingEntities to a Map, ordered by priority
    missingEntities = this.sortMissingEntities(missingEntities);

    return { matchedEntities, missingEntities };
  }

  /**
   * Compute sorted missing entities as a Map, ordered by priority
   * @param {Object} missingEntities - missing entities
   * @returns {Object} map of missing entities with key sorted
   */
  sortMissingEntities(missingEntities) {
    logger.debug('sortMissingEntities', { missingEntities });
    if (Object.keys(missingEntities).length === 0) {
      return new Map();
    }
    const sortedNames = Object.keys(missingEntities).sort(
      (a, b) => missingEntities[b].priority - missingEntities[a].priority,
    );
    return new Map(sortedNames.map(name => [name, missingEntities[name]]));
  }

  /**
   * Executes the dialog.
   * @async
   * @param {Object} userMessage - the user message
   * @param {Object} data - the data
   * @returns {Promise.<Object>} an action
   */
  async execute(userMessage, data) {
    logger.debug('execute', { userMessage, data });
    // get message entities extracted from the message
    const { messageEntities } = data;
    const userId = userMessage.user;
    const dialogCache = await this.brain.conversationGet(userId, this.parameters.namespace);
    const previouslyMatchedEntities = (dialogCache && dialogCache._entities) || {};
    const previousQuestionEntity = (dialogCache && dialogCache._question) || undefined;
    logger.debug('execute', { previouslyMatchedEntities });
    // Get missing entities and matched entities
    const { missingEntities, matchedEntities } = await this.computeEntities(
      messageEntities,
      this.parameters.entities,
      previouslyMatchedEntities,
      previousQuestionEntity,
    );
    logger.debug('execute', { missingEntities, matchedEntities });
    // save matched entities and next question in the brain
    await this.brain.conversationSet(userId, this.parameters.namespace, {
      _entities: matchedEntities,
      _question: missingEntities.size > 0 ? missingEntities.keys().next().value : undefined,
    });
    data = { ...data, missingEntities, matchedEntities };
    const extraData = await this.dialogWillDisplay(userMessage, data);
    data = this.mergeData(extraData, data);
    const botMessages = await this.display(userMessage, data);
    const action = await this.dialogWillComplete(userMessage, data);
    return {
      action,
      botMessages,
    };
  }

  /** @inheritDoc */
  async dialogWillComplete(userMessage, data) {
    logger.debug('dialogWillComplete', { userMessage, data });
    if (data.missingEntities.size === 0) {
      return this.complete();
    }
    return this.wait();
  }
}

module.exports = PromptDialog;
