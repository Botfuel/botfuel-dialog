# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="11.5.0"></a>
# [11.5.0](https://github.com/Botfuel/botfuel-dialog/compare/v11.4.0...v11.5.0) (2018-09-18)


### Bug Fixes

* trigger the default dialog when the user trigger the same intent without new entity ([57d4e7a](https://github.com/Botfuel/botfuel-dialog/commit/57d4e7a))


### Features

* add a cancel-dialog with the associated en/fr views ([50a196a](https://github.com/Botfuel/botfuel-dialog/commit/50a196a))





<a name="11.1.0"></a>
# [11.1.0](https://github.com/Botfuel/botfuel-dialog/compare/v11.0.0...v11.1.0) (2018-08-10)


### Bug Fixes

* rename intent-filter.js to classification-filter.js in testcomplexdialog ([a12a3b9](https://github.com/Botfuel/botfuel-dialog/commit/a12a3b9))
* rename intentFIlter test and function ([0018810](https://github.com/Botfuel/botfuel-dialog/commit/0018810))





<a name="11.0.0"></a>
# [11.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v10.0.2...v11.0.0) (2018-08-02)


### Bug Fixes

* Send error data properly to CatchDialog ([a0956d3](https://github.com/Botfuel/botfuel-dialog/commit/a0956d3))





<a name="10.0.2"></a>
## [10.0.2](https://github.com/Botfuel/botfuel-dialog/compare/v10.0.1...v10.0.2) (2018-07-18)





<a name="10.0.0"></a>
# [10.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v9.0.3...v10.0.0) (2018-07-18)


### Features

* Catch dialog and view allow the bot to gracefully handle errors. ([792a597](https://github.com/Botfuel/botfuel-dialog/commit/792a597))




<a name="9.0.1"></a>
## [9.0.1](https://github.com/Botfuel/botfuel-dialog/compare/v9.0.0...v9.0.1) (2018-07-06)


### Bug Fixes

* add filter intent ([1e42265](https://github.com/Botfuel/botfuel-dialog/commit/1e42265))





<a name="9.0.0"></a>
# [9.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v8.3.0...v9.0.0) (2018-07-03)


### Code Refactoring

* The dialogWillComplete hook can no longer return null ([7a5a8b8](https://github.com/Botfuel/botfuel-dialog/commit/7a5a8b8))


### BREAKING CHANGES

* The dialogWillComplete hook can no longer return null.
It should instead return a dialog action such as this.complete().





<a name="8.1.1"></a>
## [8.1.1](https://github.com/Botfuel/botfuel-dialog/compare/v8.1.0...v8.1.1) (2018-06-26)

**Note:** Version bump only for package sample-botfuel-dialog-complexdialogs





<a name="8.0.4"></a>
## [8.0.4](https://github.com/Botfuel/botfuel-dialog/compare/v8.0.3...v8.0.4) (2018-06-06)

**Note:** Version bump only for package sample-botfuel-dialog-complexdialogs





<a name="8.0.0"></a>
# [8.0.0](https://github.com/Botfuel/bot-sdk2/compare/v7.2.6...v8.0.0) (2018-05-22)


### Bug Fixes

* fix links to concepts and getting-started in new doc ([7db8e28](https://github.com/Botfuel/bot-sdk2/commit/7db8e28))





<a name="7.0.0"></a>
# [7.0.0](https://github.com/Botfuel/bot-sdk2/compare/v5.1.7...v7.0.0) (2018-04-18)

**Note:** Version bump only for package sample-botfuel-dialog-complexdialogs





<a name="5.1.1"></a>
## [5.1.1](https://github.com/Botfuel/botfuel-dialog/compare/v5.1.0...v5.1.1) (2018-04-16)

**Note:** Version bump only for package sample-botfuel-dialog-complexdialogs





<a name="5.1.0"></a>
# [5.1.0](https://github.com/Botfuel/botfuel-dialog/compare/v5.0.0...v5.1.0) (2018-04-16)


### Bug Fixes

* Fix lerna run style ([b7206ea](https://github.com/Botfuel/botfuel-dialog/commit/b7206ea))


### Features

* botfuel nlu use trainer api ([083f578](https://github.com/Botfuel/botfuel-dialog/commit/083f578))





<a name="5.0.0"></a>
# [5.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v4.4.3...v5.0.0) (2018-04-03)


### Bug Fixes

* remove undefined value in matchedEntities object ([8f9555d](https://github.com/Botfuel/botfuel-dialog/commit/8f9555d))


### Code Refactoring

* (breaking change) store prompt dialog in brain with new strucutre {entities: ..., question:...} ([599b8c8](https://github.com/Botfuel/botfuel-dialog/commit/599b8c8))


### BREAKING CHANGES

* this can cause conflict on running bot with MongoBrain





<a name="4.0.0"></a>
# [4.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v3.0.1...v4.0.0) (2018-03-02)





**Note:** Version bump only for package sample-botfuel-dialog-complexdialogs

<a name="2.1.5"></a>
## [2.1.5](https://github.com/Botfuel/botfuel-dialog/compare/v2.1.4...v2.1.5) (2018-02-28)




**Note:** Version bump only for package sample-botfuel-dialog-complexdialogs

<a name="2.1.2"></a>
## [2.1.2](https://github.com/Botfuel/botfuel-dialog/compare/v2.1.1...v2.1.2) (2018-02-20)


### Bug Fixes

* Fix issue where isFulfilled dialog entities were not updated properly ([a1986f7](https://github.com/Botfuel/botfuel-dialog/commit/a1986f7))




<a name="2.1.1"></a>
## [2.1.1](https://github.com/Botfuel/botfuel-dialog/compare/v2.1.0...v2.1.1) (2018-02-15)




**Note:** Version bump only for package sample-botfuel-dialog-complexdialogs

<a name="2.0.0"></a>
# [2.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v1.9.0...v2.0.0) (2018-02-13)


### Features

* Standardized dialog hooks ([80f1e45](https://github.com/Botfuel/botfuel-dialog/commit/80f1e45))




<a name="1.8.3"></a>
## [1.8.3](https://github.com/Botfuel/bot-sdk2/compare/v1.8.2...v1.8.3) (2018-02-09)




**Note:** Version bump only for package sample-botfuel-dialog-complexdialogs

<a name="1.8.2"></a>
## [1.8.2](https://github.com/Botfuel/botfuel-dialog/compare/v1.8.1...v1.8.2) (2018-02-06)




**Note:** Version bump only for package sample-botfuel-dialog-complexdialogs

<a name="1.8.0"></a>
# [1.8.0](https://github.com/Botfuel/bot-sdk2/compare/v1.7.1...v1.8.0) (2018-02-01)




**Note:** Version bump only for package sample-botfuel-dialog-complexdialogs

<a name="1.6.0"></a>
# [1.6.0](https://github.com/Botfuel/bot-sdk2/compare/v1.5.0...v1.6.0) (2018-01-22)


### Features

* Add changelog ([65660ef](https://github.com/Botfuel/bot-sdk2/commit/65660ef))
