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

const {
  makePositionsArray,
  doEntitiesIntersect,
  filterIntersectingEntities,
} = require('../../src/utils/entities');

describe('Entities utils', () => {
  describe('makePositionsArray', () => {
    test('should return an array of numbers indicating characters positions occupied by en entity within a string', async () => {
      expect(
        makePositionsArray({
          start: 5,
          end: 10,
        }),
      ).toEqual([5, 6, 7, 8, 9]);
    });
    test('should work with 0 as a start index', async () => {
      expect(
        makePositionsArray({
          start: 0,
          end: 1,
        }),
      ).toEqual([0]);
    });
  });

  describe('doEntitiesIntersect', () => {
    test('should return true if entities have a position in common', async () => {
      expect(
        doEntitiesIntersect(
          {
            start: 5,
            end: 10,
          },
          {
            start: 9,
            end: 11,
          },
        ),
      ).toBe(true);
    });

    test('should work the same regardless of entities order', async () => {
      expect(
        doEntitiesIntersect(
          {
            start: 9,
            end: 11,
          },
          {
            start: 5,
            end: 10,
          },
        ),
      ).toBe(true);
    });

    test('should return false if entities do not have a position in common', async () => {
      expect(
        doEntitiesIntersect(
          {
            start: 0,
            end: 5,
          },
          {
            start: 5,
            end: 10,
          },
        ),
      ).toBe(false);
    });
  });

  describe('filterIntersectingEntities', () => {
    test('should return entities that do not intersect with the entity parameter', async () => {
      expect(
        filterIntersectingEntities(
          [
            {
              start: 5,
              end: 8,
            },
            {
              start: 8,
              end: 12,
            },
            {
              start: 10,
              end: 15,
            },
            {
              start: 20,
              end: 25,
            },
          ],
          {
            start: 9,
            end: 15,
          },
        ),
      ).toEqual([
        {
          start: 5,
          end: 8,
        },
        {
          start: 20,
          end: 25,
        },
      ]);
    });

    test('should return entities that are different from the entity parameter if it doesn’t have start or end', async () => {
      expect(
        filterIntersectingEntities(
          [
            {
              start: 5,
              end: 8,
            },
            {
              start: 8,
              end: 12,
            },
            {
              start: 10,
              end: 15,
            },
            {
              start: 20,
              end: 25,
            },
            {
              dim: 'number',
            },
          ],
          {
            dim: 'number',
          },
        ),
      ).toEqual([
        {
          start: 5,
          end: 8,
        },
        {
          start: 8,
          end: 12,
        },
        {
          start: 10,
          end: 15,
        },
        {
          start: 20,
          end: 25,
        },
      ]);
    });
  });
});
