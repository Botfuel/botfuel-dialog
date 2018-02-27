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

const isEqual = require('lodash/isEqual');
const intersection = require('lodash/intersection');

export const makePositionsArray = entity =>
  Array(entity.end - entity.start)
    .fill()
    .map((_, i) => i + entity.start);

export const doEntitiesIntersect = (entityA, entityB) =>
  !!intersection(makePositionsArray(entityA), makePositionsArray(entityB)).length;

export const filterIntersectingEntities = (entities, entity) => {
  if (entity.start == null || entity.end == null) {
    return entities.filter(e => !isEqual(e, entity));
  }
  return entities.filter(e => !doEntitiesIntersect(e, entity));
};
