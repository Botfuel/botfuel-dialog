# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.


<a name="4.1.0"></a>
## [4.1.0](https://github.com/Botfuel/botfuel-dialog/compare/v4.0.0...v4.1.0) (2018-03-12)

### New features

* Assign uuid to conversations

### Refactoring

* Rename the methods used by the web adapter to build POST request
  * `getUri` -> `getUrl`
  * `getQs` -> `getQueryParameters`

### Bug fixes

* Fix dialog resolution for custom adapters

<a name="4.0.0"></a>
# [4.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v3.0.1...v4.0.0) (2018-03-02)


### Bug Fixes

* Fix greetings dialog ([de03b2e](https://github.com/Botfuel/botfuel-dialog/commit/de03b2e))


### BREAKING CHANGES

* Brain structure has changed



<a name="3.0.1"></a>
## [3.0.1](https://github.com/Botfuel/bot-sdk2/compare/v3.0.0...v3.0.1) (2018-03-01)


### Bug Fixes

* Fix shell adapter broken by [#120](https://github.com/Botfuel/bot-sdk2/issues/120) ([f1b38b7](https://github.com/Botfuel/bot-sdk2/commit/f1b38b7))





<a name="3.0.0"></a>
# [3.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v2.1.5...v3.0.0) (2018-03-01)

### Breaking changes

* Add members brain, nlu, adapters to the bot config ([7d3f080](https://github.com/Botfuel/botfuel-dialog/commit/7d3f080)). See [this sample config](https://github.com/Botfuel/botfuel-dialog/blob/master/packages/test-resolvers/test-config.js).

* Now the exported class `Nlu` is an abstract class that is subclassed by `BotfuelNlu`. ([821a863](https://github.com/Botfuel/botfuel-dialog/commit/821a863))

* Some renamings ([#124](https://github.com/Botfuel/botfuel-dialog/pull/124)):
* `brain.getValue` -> `brain.botGet`
* `brain.setValue` -> `brain.botSet`
* `adapter.initUserIfNecessary` -> `adapter.addUserIfNecessary`
* `brain.initUserIfNecessary` -> `brain.addUserIfNecessary`

### Features

The package [test-resolvers](https://github.com/Botfuel/botfuel-dialog/tree/master/packages/test-resolvers) provides samples for the following new features:

* NLU modules can be resolved and loaded ([44fc9c2](https://github.com/Botfuel/botfuel-dialog/commit/44fc9c2)).

* Brain modules can be resolved and loaded ([e81c4bb](https://github.com/Botfuel/botfuel-dialog/commit/e81c4bb)).

* Export base brain class to allow suclassing ([7133ca8](https://github.com/Botfuel/botfuel-dialog/commit/7133ca8)).



<a name="2.1.5"></a>
## [2.1.5](https://github.com/Botfuel/botfuel-dialog/compare/v2.1.4...v2.1.5) (2018-02-28)




**Note:** Version bump only for package undefined

<a name="2.1.4"></a>
## [2.1.4](https://github.com/Botfuel/botfuel-dialog/compare/v2.1.3...v2.1.4) (2018-02-26)


### Bug Fixes

* Add user id in middleware contexts ([45e8d6c](https://github.com/Botfuel/botfuel-dialog/commit/45e8d6c))
* Compare intents hashes instead of timestamps ([838bbf5](https://github.com/Botfuel/botfuel-dialog/commit/838bbf5))
* Make userId reliant functions throw when user does not exist ([9fbc4a3](https://github.com/Botfuel/botfuel-dialog/commit/9fbc4a3))




<a name="2.1.3"></a>
## [2.1.3](https://github.com/Botfuel/botfuel-dialog/compare/v2.1.2...v2.1.3) (2018-02-20)




**Note:** Version bump only for package undefined

<a name="2.1.2"></a>
## [2.1.2](https://github.com/Botfuel/botfuel-dialog/compare/v2.1.1...v2.1.2) (2018-02-20)


### Bug Fixes

* Fix environment variables issues during tests ([626bcfb](https://github.com/Botfuel/botfuel-dialog/commit/626bcfb))
* Fix issue where isFulfilled dialog entities were not updated properly ([a1986f7](https://github.com/Botfuel/botfuel-dialog/commit/a1986f7))




<a name="2.1.1"></a>
## [2.1.1](https://github.com/Botfuel/botfuel-dialog/compare/v2.1.0...v2.1.1) (2018-02-15)




**Note:** Version bump only for package undefined

<a name="2.1.0"></a>
# [2.1.0](https://github.com/Botfuel/botfuel-dialog/compare/v2.0.0...v2.1.0) (2018-02-14)


### Bug Fixes

* Display port at info level when using web adapter ([87cd16c](https://github.com/Botfuel/botfuel-dialog/commit/87cd16c))
* Expose user message in out middleware context ([f23a716](https://github.com/Botfuel/botfuel-dialog/commit/f23a716))
* Fix out middleware issue with done function ([40dae85](https://github.com/Botfuel/botfuel-dialog/commit/40dae85))


### Features

* Add BotImageMessage message ([3a6a622](https://github.com/Botfuel/botfuel-dialog/commit/3a6a622))




<a name="2.0.0"></a>
# [2.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v1.9.0...v2.0.0) (2018-02-13)


### Features

* Add spanish boolean corpus ([46b4dd8](https://github.com/Botfuel/botfuel-dialog/commit/46b4dd8))
* Standardized dialog hooks ([80f1e45](https://github.com/Botfuel/botfuel-dialog/commit/80f1e45))




<a name="1.9.0"></a>
# [1.9.0](https://github.com/Botfuel/botfuel-dialog/compare/v1.8.3...v1.9.0) (2018-02-12)


### Bug Fixes

* Expose QnasView ([14d4167](https://github.com/Botfuel/botfuel-dialog/commit/14d4167))


### Features

* Expose config in middlewares context ([40973da](https://github.com/Botfuel/botfuel-dialog/commit/40973da))
* Handlebars templates support: route /templates serves files under src/templates ([19bcbdf](https://github.com/Botfuel/botfuel-dialog/commit/19bcbdf))




<a name="1.8.3"></a>
## [1.8.3](https://github.com/Botfuel/bot-sdk2/compare/v1.8.2...v1.8.3) (2018-02-09)


### Bug Fixes

* Give context to intent filter when no QnA ([814c0ff](https://github.com/Botfuel/bot-sdk2/commit/814c0ff))
* refactor Message.toJson() method ([bf256c6](https://github.com/Botfuel/bot-sdk2/commit/bf256c6))




<a name="1.8.2"></a>
## [1.8.2](https://github.com/Botfuel/botfuel-dialog/compare/v1.8.1...v1.8.2) (2018-02-06)


### Bug Fixes

* test-qna tests ([80997d7](https://github.com/Botfuel/botfuel-dialog/commit/80997d7))




<a name="1.8.1"></a>
## [1.8.1](https://github.com/Botfuel/bot-sdk2/compare/v1.8.0...v1.8.1) (2018-02-01)


### Bug Fixes

* Check for bot message when extracting user ([1c95274](https://github.com/Botfuel/bot-sdk2/commit/1c95274))
* Fix compile command ([743affd](https://github.com/Botfuel/bot-sdk2/commit/743affd))




<a name="1.8.0"></a>
# [1.8.0](https://github.com/Botfuel/bot-sdk2/compare/v1.7.1...v1.8.0) (2018-02-01)


### Features

* Define conversation duration in the config ([e24535d](https://github.com/Botfuel/bot-sdk2/commit/e24535d))
* info logger ([3a66941](https://github.com/Botfuel/bot-sdk2/commit/3a66941))




<a name="1.7.1"></a>
## [1.7.1](https://github.com/Botfuel/botfuel-dialog/compare/v1.7.0...v1.7.1) (2018-01-24)


### Bug Fixes

* Fix mute dialog + test in test-middlewares ([d1d88d9](https://github.com/Botfuel/botfuel-dialog/commit/d1d88d9))




<a name="1.7.0"></a>
# [1.7.0](https://github.com/Botfuel/botfuel-dialog/compare/v1.6.0...v1.7.0) (2018-01-23)


### Features

* intent filter ([a54038f](https://github.com/Botfuel/botfuel-dialog/commit/a54038f))




<a name="1.6.0"></a>
# [1.6.0](https://github.com/Botfuel/bot-sdk2/compare/v1.5.0...v1.6.0) (2018-01-22)


### Features

* Add changelog ([65660ef](https://github.com/Botfuel/bot-sdk2/commit/65660ef))




<a name="1.5.1"></a>
## [1.5.1](https://github.com/Botfuel/bot-sdk2/compare/v1.5.0...v1.5.1) (2018-01-22)




**Note:** Version bump only for package root
