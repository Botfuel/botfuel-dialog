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

const PlainFacetDb = require('../../src/dbs/plain-facet-db');

describe('Facet Db', () => {
  describe('getHits', () => {
    test('should return the correct nb of hits', async () => {
      const db = new PlainFacetDb(
        [
          { f1: 1, f2: 1 },
          { f1: 2, f2: 1 },
          { f1: 3, f2: 2 },
          { f1: 4, f2: 2 },
        ],
        {
          filter: PlainFacetDb.DEFAULTFILTER({
            f1: PlainFacetDb.EQUAL,
            f2: PlainFacetDb.EQUAL,
          }),
        },
      );
      expect(db.getHits({ f2: 2 })).toEqual([
        { f1: 3, f2: 2 },
        { f1: 4, f2: 2 },
      ]);
    });
  });

  describe('done', () => {
    test('should return false when not done', async () => {
      const db = new PlainFacetDb(
        [
          { f1: 1, f2: 1 },
          { f1: 2, f2: 1 },
          { f1: 3, f2: 2 },
          { f1: 4, f2: 2 },
        ],
        {
          done: hits => hits.length < 3,
          filter: PlainFacetDb.DEFAULTFILTER({
            f1: PlainFacetDb.EQUAL,
            f2: PlainFacetDb.EQUAL,
          }),
        },
      );
      expect(db.done({})).toBe(false);
    });

    test('should return true when done', async () => {
      const db = new PlainFacetDb(
        [
          { f1: 1, f2: 1 },
          { f1: 2, f2: 1 },
          { f1: 3, f2: 2 },
          { f1: 4, f2: 2 },
        ],
        {
          done: hits => hits.length < 3,
          filter: PlainFacetDb.DEFAULTFILTER({
            f1: PlainFacetDb.EQUAL,
            f2: PlainFacetDb.EQUAL,
          }),
        },
      );
      expect(db.done({ f2: 2 })).toBe(true);
    });
  });

  describe('getDeducedFacets', () => {
    test('should return the deduced facets when all db', async () => {
      const db = new PlainFacetDb(
        [
          { f1: 1, f2: 1 },
          { f1: 2, f2: 1 },
          { f1: 3, f2: 2 },
          { f1: 4, f2: 2 },
        ],
        {
          filter: PlainFacetDb.DEFAULTFILTER({
            f1: PlainFacetDb.EQUAL,
            f2: PlainFacetDb.EQUAL,
          }),
        },
      );
      expect(db.getDeducedFacets(['f1', 'f2'], {})).toEqual([]);
    });

    test('should return the deduced facets', async () => {
      const db = new PlainFacetDb(
        [
          { f1: 1, f2: 1 },
          { f1: 2, f2: 1 },
          { f1: 3, f2: 2 },
          { f1: 4, f2: 2 },
        ],
        {
          filter: PlainFacetDb.DEFAULTFILTER({
            f1: PlainFacetDb.EQUAL,
            f2: PlainFacetDb.EQUAL,
          }),
        },
      );
      expect(db.getDeducedFacets(['f1', 'f2'], { f2: 1 })).toEqual(['f2']);
    });

    test('should return the deduced facets when no data', async () => {
      const db = new PlainFacetDb(
        [
          { f1: 1, f2: 1 },
          { f1: 2, f2: 1 },
          { f1: 3, f2: 2 },
          { f1: 4, f2: 2 },
        ],
        {
          filter: PlainFacetDb.DEFAULTFILTER({
            f1: PlainFacetDb.EQUAL,
            f2: PlainFacetDb.EQUAL,
          }),
        },
      );
      expect(db.getDeducedFacets(['f1', 'f2'], { f2: 100 })).toEqual([
        'f1',
        'f2',
      ]);
    });
  });

  describe('getFacetWithMinMaxHits', () => {
    test('should return the facet with max hits and correct count', async () => {
      const db = new PlainFacetDb(
        [
          { f1: 1, f2: 1 },
          { f1: 1, f2: 2 },
          { f1: 2, f2: 3 },
          { f1: 2, f2: 4 },
        ],
        {
          filter: (query, row) => {
            if (query.f1 && query.f1 !== row.f1) {
              return false;
            }
            if (query.f2 && query.f2 !== row.f2) {
              return false;
            }
            return true;
          },
        },
      );

      expect(db.selectFacetMinMaxStrategy(['f1', 'f2'], {})).toEqual({
        facet: 'f2',
        maxValueCount: 1,
      });
    });
  });
});
