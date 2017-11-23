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

const keyBy = require('lodash/keyBy');
const logger = require('logtown')('PromptDialog');
const Dialog = require('./dialog');

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
   * Computes the missing entities.
   * @async
   * @param {String} userId - the user id
   * @param {Object[]} messageEntities - the message entities
   * @returns {Promise.<String[]>}
   */
  async computeMissingEntities(userId, messageEntities) {
    logger.debug('computeMissingEntities', userId, messageEntities);
    const { namespace, entities } = this.parameters;

    const dialogEntities = (await this.brain.conversationGet(userId, namespace)) || {};
    // Map of the unique entity names detected in the message
    const detectedEntities = keyBy(messageEntities, 'name');

    // Compute the new dialog entities
    Object.keys(detectedEntities).forEach((entityName) => {
      const entityParameter = entities.get(entityName);

      // If the reducer function is not defined, we replace the old entity by the new one
      dialogEntities[entityName] = entityParameter.reducer
        ? entityParameter.reducer(
          dialogEntities[entityName] || [],
          messageEntities.filter(e => e.name === entityName),
        )
        : messageEntities.filter(e => e.name === entityName);
    });

    logger.debug('computeMissingEntities: dialogEntities', dialogEntities);

    await this.brain.conversationSet(userId, namespace, dialogEntities);

    const missingEntities = Array.from(entities.keys()).filter(
      (entityName) => {
        if (entities.get(entityName).isFulfilled) {
          return !entities.get(entityName).isFulfilled(
            dialogEntities[entityName],
            { dialogEntities },
          );
        }

        // If the fulfilled function is not defined, we consider that the fulfilled condition
        // is met if the entity simply exists.
        return dialogEntities[entityName] === undefined;
      },
    );

    logger.debug('computeMissingEntities: missingEntities', missingEntities);

    return missingEntities;
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
      entity => this.parameters.entities.get(entity.name) !== undefined,
    );

    // Get missing entities
    const missingEntities = await this.computeMissingEntities(userId, messageEntities);
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
