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
 * parameters is an Object containing:
 * a namespace String representing the label of the dialog
 * a entities parameters Object:
 * map of entities expected by the dialog: {
 *   <entityName>: {
 *     dim: String,
 *     priority: Number or Function that returns a Number: entities parameters
 *       will be matched with potential raw entities
 *        in order or priority (highest first)
 *     isFulfilled: Function: Function returning a boolean that determines
 *       when to stop (true) or continue (false)
 *       extracting for a given entity parameter
 *     reducer: Function: Function that determines what to do each time a raw entity
 *       matches with an entity parameter: replace the previously matched entity, append it...
 *   }
 * }
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
   * @param {Object} entityParameter - entity parameter we want to match with
   * one or more raw entities.
   * @param {Array<Object>} messageEntityCandidates - array of raw entities extracted
   * from a message: {
   *     dim: String,
   *     body: String,
   *     start: Number,
   *     end: Number,
   *     values: Array<Object>
   * }
   * @param {Object} initialEntityValue - initial value of the entity we want to match
   * @returns {Object} object containing
   *   remainingMessageEntities (messageEntityCandidates minus candidates used) and
   *   entityNewValue (value we matched with the entityParameter)
   */
  matchEntityParameterWithCandidates({
    entityParameter,
    messageEntityCandidates,
    initialEntityValue,
  }) {
    const candidates = messageEntityCandidates.filter(
      candidate => candidate.dim === entityParameter.dim,
    );

    return candidates.reduce(({
      entityNewValue,
      remainingMessageEntities,
  }, candidate) => {
      if (entityParameter.isFulfilled(entityNewValue)) {
        return {
          remainingMessageEntities,
          entityNewValue,
        };
      }

      return {
        remainingMessageEntities: filterSamePositionEntities(
          remainingMessageEntities,
          candidate,
        ),
        entityNewValue: entityParameter.reducer(entityNewValue, candidate),
      };
    }, {
      remainingMessageEntities: messageEntityCandidates,
      entityNewValue: initialEntityValue,
    });
  }

  /**
   * @param {Array.<Object>} messageEntityCandidates
   *  - array of raw entities given by the extractor. They are candidates for the entity parameters
   * @param {Object} entitiesDialogParameters - map of entities expected by the dialog: {
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
  computeEntities(messageEntityCandidates, entitiesDialogParameters, dialogEntities = {}) {
    // Setup default values for entities
    const entityParameters = Object.keys(entitiesDialogParameters).reduce(
      (allEntities, entityParameterName) => ({
        ...allEntities,
        [entityParameterName]: {
          // If the reducer function is not defined, we replace the old entities by the new ones
          reducer: (oldEntities, newEntities) => newEntities,
          // If the fulfilled function is not defined, we consider that the fulfilled condition
          // is met if the entity simply exists.
          isFulfilled: entity => entity !== undefined,
          priority: 0,
          ...entitiesDialogParameters[entityParameterName],
        },
      }),
      {},
    );

    const result = Object.keys(entityParameters)
      // We do not look for entities that are already fulfilled
      .filter(
      entityParameterName =>
        !entityParameters[entityParameterName].isFulfilled(
          dialogEntities[entityParameters],
          { dialogEntities },
        ),
    )
      // Sort expected entities by priority descending (highest priority first)
      .sort((entityParameterNameA, entityParameterNameB) => {
        const priorityA = entityParameters[entityParameterNameA].priority;
        const priorityB = entityParameters[entityParameterNameB].priority;
        const entityAPriority =
          typeof priorityA === 'function'
            ? priorityA()
            : priorityA;
        const entityBPriority =
          typeof priorityB === 'function'
            ? priorityB()
            : priorityB;

        return entityBPriority - entityAPriority;
      })
      .reduce(
      (previous, entityParameterName) => {
        const entityParameter = entityParameters[entityParameterName];
        const { entityNewValue, remainingMessageEntities } = this
          .matchEntityParameterWithCandidates({
            entityParameter: entityParameters[entityParameterName],
            messageEntityCandidates: previous.remainingMessageEntityCandidates,
            initialEntityValue: dialogEntities[entityParameterName],
          });

        const isFulfilled = entityParameter.isFulfilled(entityNewValue, { dialogEntities });

        return {
          // Store the found entities here as a { <entityName>: <entity> } map
          matchedEntities: {
            ...previous.matchedEntities,
            [entityParameterName]: isFulfilled
              ? entityNewValue
              : previous.matchedEntities[entityParameterName],
          },
          remainingMessageEntityCandidates: remainingMessageEntities,
          // If an entity matching the one we are expecting was found,
          // remove it from missing entities
          // If it was not found, keep missing entities intact
          missingEntities: isFulfilled
            ? omit(previous.missingEntities, [entityParameterName])
            : previous.missingEntities,
        };
      },
      {
        matchedEntities: dialogEntities,
        remainingMessageEntityCandidates: messageEntityCandidates,
        missingEntities: entityParameters,
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
   * @param {Object[]} [messageEntityCandidates] - the message entities extracted from the message
   * @returns {Promise.<String>} the new dialog status
   */
  async executeWhenBlocked(adapter, userId, messageEntityCandidates) {
    logger.debug('executeWhenBlocked', userId, messageEntityCandidates);
    await this.display(adapter, userId, 'ask');
    return { status: this.STATUS_WAITING };
  }

  /**
   * Executes the dialog when status is 'waiting'.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} messageEntityCandidates - the message entities extracted from the message
   * @returns {Promise.<String>} the new dialog status
   */
  async executeWhenWaiting(adapter, userId, messageEntityCandidates) {
    logger.debug('executeWhenWaiting', userId, messageEntityCandidates);
    for (const messageEntity of messageEntityCandidates) {
      if (messageEntity.dim === 'system:boolean') {
        const booleanValue = messageEntity.values[0].value;
        logger.debug('execute: system:boolean', booleanValue);
        if (booleanValue) {
          // eslint-disable-next-line no-await-in-loop
          await this.display(adapter, userId, 'confirm');
          return this.executeWhenReady(adapter, userId, messageEntityCandidates);
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
   * @param {Object[]} messageEntityCandidates - the message entities extracted from the message
   * @returns {Promise.<string>} the new dialog status
   */
  async executeWhenReady(adapter, userId, messageEntityCandidates) {
    logger.debug('executeWhenReady', userId, messageEntityCandidates);
    // Keep entities defined in the dialog
    messageEntityCandidates = messageEntityCandidates.filter(
      entity => this.parameters.entities[entity.name] !== undefined,
    );

    const dialogEntities =
      (await this.brain.conversationGet(userId, this.parameters.namespace)) || {};
    // Get missing entities and matched entities
    const { missingEntities, matchedEntities } = this.computeEntities(
      messageEntityCandidates,
      this.parameters.entities,
      dialogEntities,
    );

    await this.brain.conversationSet(userId, this.parameters.namespace, matchedEntities);

    await this.display(adapter, userId, 'entities', { messageEntityCandidates, missingEntities });
    if (missingEntities.length === 0) {
      return this.executeWhenCompleted(adapter, userId, messageEntityCandidates);
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
  async execute(adapter, userId, messageEntityCandidates, status) {
    logger.debug('execute', userId, messageEntityCandidates, status);
    switch (status) {
      case this.STATUS_BLOCKED:
        return this.executeWhenBlocked(adapter, userId, messageEntityCandidates);
      case this.STATUS_WAITING:
        return this.executeWhenWaiting(adapter, userId, messageEntityCandidates);
      default:
        return this.executeWhenReady(adapter, userId, messageEntityCandidates);
    }
  }
}

module.exports = PromptDialog;
