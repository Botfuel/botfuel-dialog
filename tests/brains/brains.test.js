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

/* eslint-disable prefer-arrow-callback */

const brainTest = require('./brain-test');

const MONGO_BRAIN_LABEL = 'mongo';
const MEMORY_BRAIN_LABEL = 'memory';

describe('Brains', () => {
  describe('MongoBrain', function () { brainTest(MONGO_BRAIN_LABEL); });
  describe('MemoryBrain', function () { brainTest(MEMORY_BRAIN_LABEL); });
});
