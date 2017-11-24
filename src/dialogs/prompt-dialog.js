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
const Dialog = require('./dialog');

// Helper functions
const areEntitiesPositionsEqual = (entityA, entityB) =>
  entityA.start === entityB.start && entityA.end === entityB.end;

const filterSamePositionEntities = (entities, entity) =>
  entities.filter(e => !areEntitiesPositionsEqual(e, entity));

/**
 * The prompt dialog prompts the user for a number of entities.
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
   * @param {Array.<Object>} messageEntities - array of candidates entities given by the extractor
   * @param {Object} expectedEntities - map of entities expected by the dialog: {
   *   <entityName>: {
   *     dim: String,
   *     priority: Number or Function,
   *     isFulfilled: Function()
   *     reducer: Function(),
   *   }
   * }
   * @param {Object} dialogEntities - a map of the entities already matched for this dialog: {
   *   <entityName>: <messageEntity>
   * }
   * @returns {Object} object containing missingEntities(subset of expectedEntities) and
   *  matchedEntities (same structure as dialogEntities)
   */
  computeEntities(messageEntities, expectedEntities, dialogEntities = {}) {
    // Setup default values for entities
    const entities = Object.keys(expectedEntities).reduce(
      (allEntities, key) => ({
        ...allEntities,
        [key]: {
          // If the reducer function is not defined, we replace the old entities by the new ones
          reducer: (oldEntities, newEntities) => newEntities,
          // If the fulfilled function is not defined, we consider that the fulfilled condition
          // is met if the entity simply exists.
          isFulfilled: entity => entity !== undefined,
          priority: 0,
          ...expectedEntities[key],
        },
      }),
      {},
    );

    const result = Object.keys(entities)
      // We do not look for entities that are already fulfilled
      .filter(
        entityName =>
          !entities[entityName].isFulfilled(dialogEntities[entityName], { dialogEntities }),
      )
      // Sort expected entities by priority descending (highest priority first)
      .sort((entityNameA, entityNameB) => {
        const entityAPriority =
          typeof entities[entityNameA].priority === 'function'
            ? entities[entityNameA].priority()
            : entities[entityNameA].priority;
        const entityBPriority =
          typeof entities[entityNameB].priority === 'function'
            ? entities[entityNameB].priority()
            : entities[entityNameB].priority;

        return entityBPriority - entityAPriority;
      })
      .reduce(
        (acc, entityName) => {
          // Candidates are message entities with the dimension we are looking for
          const candidates = acc.messageEntities.filter(
            entity => entity.dim === entities[entityName].dim,
          );

          // Store remaining message entities
          let remainingMessageEntities = acc.messageEntities;
          // Get the previous value for this entity if any
          let entityNewValue = acc.matchedEntities[entityName];
          let i = 0;

          // Loop on candidates until the condition is fulfilled or we run out of candidates
          if (candidates.length) {
            while (!entities[entityName].isFulfilled(entityNewValue, { dialogEntities })) {
              // Apply reducer to get entity's new value
              entityNewValue = entities[entityName].reducer(entityNewValue, candidates[i]);

              // Remove the candidate and all candidates at the same position
              // from the remaining message entities
              remainingMessageEntities = filterSamePositionEntities(
                remainingMessageEntities,
                candidates[i],
              );
              i++;

              // The condition is not fulfilled but we used all candidates, exit
              if (i === candidates.length) {
                break;
              }
            }
          }

          return {
            // Store the found entities here as a { <entityName>: <entity> } map
            matchedEntities: {
              ...acc.matchedEntities,
              [entityName]: entityNewValue,
            },
            messageEntities: remainingMessageEntities,
            // If an entity matching the one we are expecting was found,
            // remove it from missing entities
            // If it was not found, keep missing entities intact
            missingEntities: entities[entityName].isFulfilled(entityNewValue, { dialogEntities })
              ? omit(acc.missingEntities, [entityName])
              : acc.missingEntities,
          };
        },
      {
        matchedEntities: dialogEntities,
        messageEntities,
        missingEntities: expectedEntities,
      },
      );

    return {
      matchedEntities: result.matchedEntities,
      missingEntities: result.missingEntities,
    };
  }

  /**
   * Executes the dialog when status is 'blocked'.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} [messageEntities] - the message entities
   * @returns {Promise.<String>} the new dialog status
   */
  async executeWhenBlocked(adapter, userId, messageEntities) {
    logger.debug('executeWhenBlocked', userId, messageEntities);
    await this.display(adapter, userId, 'ask');
    return { status: this.STATUS_WAITING };
  }

  /**
   * Executes the dialog when status is 'waiting'.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} messageEntities - the message entities
   * @returns {Promise.<String>} the new dialog status
   */
  async executeWhenWaiting(adapter, userId, messageEntities) {
    logger.debug('executeWhenWaiting', userId, messageEntities);
    for (const messageEntity of messageEntities) {
      if (messageEntity.dim === 'system:boolean') {
        const booleanValue = messageEntity.values[0].value;
        logger.debug('execute: system:boolean', booleanValue);
        if (booleanValue) {
          // eslint-disable-next-line no-await-in-loop
          await this.display(adapter, userId, 'confirm');
          return this.executeWhenReady(adapter, userId, messageEntities);
        }
        // if not confirmed, then discard dialog
        // eslint-disable-next-line no-await-in-loop
        await this.display(adapter, userId, 'discard');
        return { status: this.STATUS_DISCARDED };
      }
    }
    return { status: this.STATUS_BLOCKED };
  }

  /**
   * Executes the dialog when status is 'ready'.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} messageEntities - the message entities
   * @returns {Promise.<string>} the new dialog status
   */
  async executeWhenReady(adapter, userId, messageEntities) {
    logger.debug('executeWhenReady', userId, messageEntities);
    // Keep entities defined in the dialog
    messageEntities = messageEntities.filter(
      entity => this.parameters.entities[entity.name] !== undefined,
    );

    const dialogEntities =
      (await this.brain.conversationGet(userId, this.parameters.namespace)) || {};
    // Get missing entities and matched entities
    const { missingEntities, matchedEntities } = this.computeEntities(
      messageEntities,
      this.parameters.entities,
      dialogEntities,
    );

    await this.brain.conversationSet(userId, this.parameters.namespace, matchedEntities);

    await this.display(adapter, userId, 'entities', { messageEntities, missingEntities });
    if (missingEntities.length === 0) {
      return this.executeWhenCompleted(adapter, userId, messageEntities);
    }

    return { status: this.STATUS_READY };
  }

  /**
   * Executes the dialog when status is 'completed'.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} messageEntities - the message entities
   * @returns {Promise.<string>} the new dialog status
   */
  async executeWhenCompleted() {
    logger.debug('executeWhenCompleted');
    return { status: this.STATUS_COMPLETED };
  }

  // eslint-disable-next-line require-jsdoc
  async execute(adapter, userId, messageEntities, status) {
    logger.debug('execute', userId, messageEntities, status);
    switch (status) {
      case this.STATUS_BLOCKED:
        return this.executeWhenBlocked(adapter, userId, messageEntities);
      case this.STATUS_WAITING:
        return this.executeWhenWaiting(adapter, userId, messageEntities);
      default:
        return this.executeWhenReady(adapter, userId, messageEntities);
    }
  }
}

module.exports = PromptDialog;
