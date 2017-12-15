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

const PromptDialog = require('../../src/dialogs/prompt-dialog');
const MemoryBrain = require('../../src/brains/memory-brain');

const TEST_BOT = process.env.BOTFUEL_APP_TOKEN;

describe('PromptDialog', () => {
  describe('computeEntities', () => {
    const brain = new MemoryBrain(TEST_BOT);
    const prompt = new PromptDialog({ path: __dirname, locale: 'en' }, brain, {
      namespace: 'testdialog',
      entities: {},
    });

    describe('simple matching', () => {
      test('should message entities with expected entities in a simple case (one entity)', () => {
        const cityEntity = {
          dim: 'city',
          start: 0,
          end: 5,
          values: [{ value: 'Paris', type: 'string' }],
          body: 'Paris',
        };

        const messageEntities = [cityEntity];

        const expectedEntities = {
          age: {
            dim: 'number',
          },
          city: {
            dim: 'city',
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {},
        );

        expect(matchedEntities).toHaveProperty('city');
        expect(matchedEntities.city).toEqual(cityEntity);
        expect(Object.keys(missingEntities)).toHaveLength(1);
      });

      test('should message entities with expected entities in a simple case (two entities)', () => {
        const ageEntity = {
          dim: 'number',
          start: 0,
          end: 2,
          values: [{ value: 42, type: 'integer' }],
          body: '42',
        };
        const weightEntity = {
          dim: 'weight',
          start: 10,
          end: 14,
          values: [{ value: 55, type: 'integer' }],
          body: '55kg',
        };

        const messageEntities = [ageEntity, weightEntity];

        const expectedEntities = {
          age: {
            dim: 'number',
          },
          weight: {
            dim: 'weight',
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {},
        );

        expect(matchedEntities).toHaveProperty('age');
        expect(matchedEntities.age).toEqual(ageEntity);
        expect(matchedEntities).toHaveProperty('weight');
        expect(matchedEntities.weight).toEqual(weightEntity);
        expect(Object.keys(missingEntities)).toHaveLength(0);
      });
    });

    describe('priority handling', () => {
      test('should match entities with highest priority first', () => {
        const ageEntity1 = {
          dim: 'number',
          start: 0,
          end: 2,
          values: [{ value: 42, type: 'integer' }],
          body: '42',
        };
        const ageEntity2 = {
          dim: 'number',
          start: 10,
          end: 14,
          values: [{ value: 24, type: 'integer' }],
          body: '24',
        };
        const ageEntity3 = {
          dim: 'number',
          start: 16,
          end: 18,
          values: [{ value: 99, type: 'integer' }],
          body: '99',
        };

        const messageEntities = [ageEntity1, ageEntity2, ageEntity3];

        const expectedEntities = {
          maxAge: {
            dim: 'number',
          },
          otherAge: {
            dim: 'number',
            priority: 2,
          },
          minAge: {
            dim: 'number',
            priority: 1,
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {},
        );

        expect(matchedEntities).toHaveProperty('otherAge');
        expect(matchedEntities.otherAge).toEqual(ageEntity1);
        expect(matchedEntities).toHaveProperty('minAge');
        expect(matchedEntities.minAge).toEqual(ageEntity2);
        expect(matchedEntities).toHaveProperty('maxAge');
        expect(matchedEntities.maxAge).toEqual(ageEntity3);
        expect(Object.keys(missingEntities)).toHaveLength(0);
      });

      test('should accept functions as a priority parameter', () => {
        const ageEntity1 = {
          dim: 'number',
          start: 0,
          end: 2,
          values: [{ value: 42, type: 'integer' }],
          body: '42',
        };
        const ageEntity2 = {
          dim: 'number',
          start: 10,
          end: 14,
          values: [{ value: 24, type: 'integer' }],
          body: '24',
        };
        const ageEntity3 = {
          dim: 'number',
          start: 16,
          end: 18,
          values: [{ value: 99, type: 'integer' }],
          body: '99',
        };

        const messageEntities = [ageEntity1, ageEntity2, ageEntity3];

        const expectedEntities = {
          maxAge: {
            dim: 'number',
          },
          otherAge: {
            dim: 'number',
            priority: () => Math.min(1, 5, 10),
          },
          minAge: {
            dim: 'number',
            priority: () => Math.max(1, 5, 10),
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {},
        );

        expect(matchedEntities).toHaveProperty('minAge');
        expect(matchedEntities.minAge).toEqual(ageEntity1);
        expect(matchedEntities).toHaveProperty('otherAge');
        expect(matchedEntities.otherAge).toEqual(ageEntity2);
        expect(matchedEntities).toHaveProperty('maxAge');
        expect(matchedEntities.maxAge).toEqual(ageEntity3);
        expect(Object.keys(missingEntities)).toHaveLength(0);
      });

      test('should retain order of fulfilled entities', () => {
        const numberEntity1 = {
          dim: 'number',
          start: 0,
          end: 2,
          values: [{ value: 15, type: 'integer' }],
          body: '15',
        };

        const messageEntities = [numberEntity1];

        const expectedEntities = {
          maxAge: {
            dim: 'number',
          },
          minAge: {
            dim: 'number',
            priority: 1,
          },
        };

        const maxAgeEntity = {
          dim: 'number',
          start: 0,
          end: 2,
          values: [{ value: 42, type: 'integer' }],
          body: '42',
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {
            maxAge: maxAgeEntity,
            minAge: {
              dim: 'number',
              start: 0,
              end: 2,
              values: [{ value: 10, type: 'integer' }],
              body: '10',
            },
          },
        );

        expect(matchedEntities).toHaveProperty('minAge');
        expect(matchedEntities.minAge).toEqual(numberEntity1);
        expect(matchedEntities).toHaveProperty('maxAge');
        expect(matchedEntities.maxAge).toEqual(maxAgeEntity);
        expect(Object.keys(missingEntities)).toHaveLength(0);
      });
    });

    describe('missing entities', () => {
      test('should return unmatched entities', () => {
        const colorEntity = {
          dim: 'color',
          start: 10,
          end: 14,
          values: [{ value: 'blue', type: 'integer' }],
          body: 'blue',
        };

        const messageEntities = [colorEntity];

        const expectedEntities = {
          color: {
            dim: 'color',
          },
          age: {
            dim: 'number',
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {},
        );

        expect(matchedEntities).toHaveProperty('color');
        expect(matchedEntities.color).toEqual(colorEntity);
        expect(matchedEntities).not.toHaveProperty('otherAge');
        expect(Object.keys(missingEntities)).toHaveLength(1);
        expect(missingEntities).toHaveProperty('age');
        expect(missingEntities.age).toBeTruthy();
      });
    });

    describe('handle multiple results for a single entity', () => {
      test('should remove candidate entities when an expected entity already matched with them', () => {
        const weightEntity1 = {
          dim: 'weight',
          start: 0,
          end: 4,
          values: [{ value: '88', type: 'integer' }],
          body: '88 kg',
        };
        const itemCountEntity1 = {
          dim: 'item-count',
          start: 0,
          end: 4,
          values: [{ value: '88', type: 'integer' }],
          body: '88 kg',
        };
        const weightEntity2 = {
          dim: 'weight',
          start: 10,
          end: 14,
          values: [{ value: '35', type: 'integer' }],
          body: '35 kg',
        };
        const itemCountEntity2 = {
          dim: 'item-count',
          start: 10,
          end: 14,
          values: [{ value: '35', type: 'integer' }],
          body: '35 kg',
        };

        const messageEntities = [weightEntity1, itemCountEntity1, weightEntity2, itemCountEntity2];

        const expectedEntities = {
          weight: {
            dim: 'weight',
          },
          itemCount: {
            dim: 'item-count',
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {},
        );

        expect(matchedEntities).toHaveProperty('weight');
        expect(matchedEntities.weight).toEqual(weightEntity1);

        expect(matchedEntities).toHaveProperty('itemCount');
        expect(matchedEntities.itemCount).toEqual(itemCountEntity2);

        expect(Object.keys(missingEntities)).toHaveLength(0);
      });

      test('should remove candidates that intersect with a matched candidate', () => {
        const ageEntity = {
          dim: 'duration',
          start: 0,
          end: 8,
          values: [{ value: 10, unit: 'year' }],
          body: '10 years',
        };

        const newAgeEntity = {
          dim: 'duration',
          start: 0,
          end: 8,
          values: [{ value: 33, unit: 'year' }],
          body: '33 years',
        };

        const numberEntity = {
          dim: 'number',
          start: 0,
          end: 2,
          values: [{ value: 10, type: 'integer' }],
          body: '10',
        };

        const messageEntities = [newAgeEntity, numberEntity];

        const expectedEntities = {
          age: {
            dim: 'duration',
          },
          favoriteNumber: {
            dim: 'number',
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {
            age: ageEntity,
          },
        );

        expect(matchedEntities).toHaveProperty('age');
        expect(matchedEntities.age).toEqual(ageEntity);

        expect(matchedEntities).toHaveProperty('favoriteNumber');
        expect(matchedEntities.favoriteNumber).toEqual(numberEntity);

        expect(Object.keys(missingEntities)).toHaveLength(0);
      });
    });

    describe('isFulfilled condition', () => {
      test('should set entity as missing if the isFulfilled condition is not met', () => {
        const numberEntity = {
          dim: 'number',
          start: 0,
          end: 2,
          values: [{ value: 50, type: 'integer' }],
          body: '50',
        };

        const messageEntities = [numberEntity];

        const expectedEntities = {
          myNumber: {
            dim: 'number',
            isFulfilled: newValue =>
              newValue && newValue.values && newValue.values[0] && newValue.values[0].value > 60,
          },
        };

        const { missingEntities } = prompt.computeEntities(messageEntities, expectedEntities, {});

        expect(Object.keys(missingEntities)).toHaveLength(1);
        expect(missingEntities).toHaveProperty('myNumber');
      });

      test('should set entity as matched if the isFulfilled condition is met', () => {
        const numberEntity = {
          dim: 'number',
          start: 0,
          end: 2,
          values: [{ value: 80, type: 'integer' }],
          body: '50',
        };

        const messageEntities = [numberEntity];

        const expectedEntities = {
          myNumber: {
            dim: 'number',
            isFulfilled: newValue =>
              newValue && newValue.values && newValue.values[0] && newValue.values[0].value > 60,
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {},
        );

        expect(matchedEntities.myNumber).toEqual(numberEntity);
        expect(Object.keys(missingEntities)).toHaveLength(0);
      });
    });

    describe('reducer parameter', () => {
      test('should use the reducer function', () => {
        const numbers = [
          {
            dim: 'number',
            values: [{ value: '55', type: 'integer' }],
            start: 0,
            end: 2,
            body: '55',
          },
          {
            dim: 'number',
            values: [{ value: '66', type: 'integer' }],
            start: 3,
            end: 5,
            body: '66',
          },
        ];

        const messageEntities = [
          {
            dim: 'number',
            values: [{ value: '77', type: 'integer' }],
            start: 0,
            end: 2,
            body: '77',
          },
          {
            dim: 'number',
            values: [{ value: '88', type: 'integer' }],
            start: 3,
            end: 5,
            body: '88',
          },
          {
            dim: 'number',
            values: [{ value: '88', type: 'integer' }],
            start: 6,
            end: 8,
            body: '99',
          },
        ];

        const expectedEntities = {
          favoriteNumbers: {
            dim: 'number',
            isFulfilled: entity => entity && entity.length === 4,
            reducer: (oldEntities, newEntity) => [...oldEntities, newEntity],
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {
            favoriteNumbers: numbers,
          },
        );

        expect(matchedEntities).toHaveProperty('favoriteNumbers');
        expect(matchedEntities.favoriteNumbers).toEqual([
          ...numbers,
          ...messageEntities.slice(0, 2),
        ]);

        expect(Object.keys(missingEntities)).toHaveLength(0);
      });
    });

    describe('replacing fulfilled entities', () => {
      test('should replace a fulfilled entity if a new message is sent', () => {
        const numbers = [
          {
            dim: 'number',
            values: [{ value: '55', type: 'integer' }],
            start: 0,
            end: 2,
            body: '55',
          },
          {
            dim: 'number',
            values: [{ value: '66', type: 'integer' }],
            start: 3,
            end: 5,
            body: '66',
          },
        ];

        const messageEntities = [
          {
            dim: 'number',
            values: [{ value: '77', type: 'integer' }],
            start: 0,
            end: 2,
            body: '77',
          },
          {
            dim: 'number',
            values: [{ value: '88', type: 'integer' }],
            start: 3,
            end: 5,
            body: '88',
          },
          {
            dim: 'number',
            values: [{ value: '99', type: 'integer' }],
            start: 6,
            end: 8,
            body: '99',
          },
        ];

        const expectedEntities = {
          favoriteNumbers: {
            dim: 'number',
            isFulfilled: entity => entity && entity.length === 2,
            reducer: (oldEntities, newEntity) => [...(oldEntities || []), newEntity],
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {
            favoriteNumbers: numbers,
          },
        );

        expect(matchedEntities).toHaveProperty('favoriteNumbers');
        expect(matchedEntities.favoriteNumbers).toEqual([...messageEntities.slice(0, 2)]);

        expect(Object.keys(missingEntities)).toHaveLength(0);
      });

      test('should not replace a fulfilled entity if extracting from a new message', () => {
        const numbers = [
          {
            dim: 'number',
            values: [{ value: '55', type: 'integer' }],
            start: 0,
            end: 2,
            body: '55',
          },
          {
            dim: 'number',
            values: [{ value: '66', type: 'integer' }],
            start: 3,
            end: 5,
            body: '66',
          },
        ];

        const messageEntities = [
          {
            dim: 'number',
            values: [{ value: '77', type: 'integer' }],
            start: 0,
            end: 2,
            body: '77',
          },
        ];

        const expectedEntities = {
          favoriteNumbers: {
            dim: 'number',
            isFulfilled: entity => entity && entity.length === 2,
            reducer: (oldEntities, newEntity) => [...(oldEntities || []), newEntity],
          },
          age: {
            dim: 'number',
          },
        };

        const { matchedEntities, missingEntities } = prompt.computeEntities(
          messageEntities,
          expectedEntities,
          {
            favoriteNumbers: numbers,
          },
        );

        expect(matchedEntities).toHaveProperty('favoriteNumbers');
        expect(matchedEntities.favoriteNumbers).toEqual(numbers);
        expect(matchedEntities.age).toEqual(messageEntities[0]);

        expect(Object.keys(missingEntities)).toHaveLength(0);
      });
    });
  });
});
