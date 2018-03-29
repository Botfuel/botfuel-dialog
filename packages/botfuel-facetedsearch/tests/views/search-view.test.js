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

const SearchView = require('../../src/views/search-view');
const { BotTextMessage } = require('botfuel-dialog');

describe('SearchView', () => {
  describe('renderEntities', () => {
    const view = new SearchView({});

    describe('when missing entities', () => {
      test('should display correct missing entity for next question facet', () => {
        expect(view.render(
          {
            user: null,
          },
          {
            matchedEntities: {},
            missingEntities: new Map([['f1', {}], ['f2', {}]]),
          },
        )).toEqual([new BotTextMessage('Which f1?')]);
      });
    });
  });
});
