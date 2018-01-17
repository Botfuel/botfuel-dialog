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

// require('../../src/logger-manager').configure({ path: '..', logger: 'botfuel'});

const MiddlewareManager = require('../../src/middleware-manager');

describe('MiddlewaresManager', () => {
  test('that it runs the middlewares in the correct order when all are exectuted', async () => {
    const mm = new MiddlewareManager(
      {},
      [
        async (context, next, done) => {
          context.log.push('middleware0: work');
          await next(async () => {
            context.log.push('middleware0: next');
            await done();
            context.log.push('middleware0: done');
          });
        },
        async (context, next, done) => {
          context.log.push('middleware1: work');
          await next(async () => {
            context.log.push('middleware1: next');
            await done();
            context.log.push('middleware1: done');
          });
        },
      ],
      [],
    );
    const context = { log: [] };
    await mm.in(context, async () => context.log.push('callback'));
    expect(context.log).toEqual([
      'middleware0: work',
      'middleware1: work',
      'callback',
      'middleware1: next',
      'middleware0: next',
      'middleware0: done',
      'middleware1: done',
    ]);
  });

  test('that it runs the middlewares in the correct order when not all are executed', async () => {
    const mm = new MiddlewareManager(
      {},
      [
        async (context, next, done) => {
          context.log.push('middleware0: work');
          context.log.push('middleware0: done');
          done();
        },
        async (context, next, done) => {
          context.log.push('middleware1: work');
          await next(async () => {
            context.log.push('middleware1: next');
            await done();
            context.log.push('middleware1: done');
          });
        },
      ],
      [],
    );
    const context = { log: [] };
    await mm.in(context, null);
    expect(context.log).toEqual(['middleware0: work', 'middleware0: done']);
  });
});
