# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="11.5.3"></a>
## [11.5.3](https://github.com/Botfuel/botfuel-dialog/compare/v11.5.2...v11.5.3) (2018-09-21)

**Note:** Version bump only for package botfuel-dialog





<a name="11.5.2"></a>
## [11.5.2](https://github.com/Botfuel/botfuel-dialog/compare/v11.5.1...v11.5.2) (2018-09-21)

**Note:** Version bump only for package botfuel-dialog





<a name="11.5.1"></a>
## [11.5.1](https://github.com/Botfuel/botfuel-dialog/compare/v11.5.0...v11.5.1) (2018-09-20)


### Bug Fixes

* Fix bug that prevents extending bot table message object  ([5f98e0b](https://github.com/Botfuel/botfuel-dialog/commit/5f98e0b))





<a name="11.5.0"></a>
# [11.5.0](https://github.com/Botfuel/botfuel-dialog/compare/v11.4.0...v11.5.0) (2018-09-18)


### Bug Fixes

* Fix userId not being passed from context ([#255](https://github.com/Botfuel/botfuel-dialog/issues/255)) ([3c46817](https://github.com/Botfuel/botfuel-dialog/commit/3c46817))
* refactoring and trigger default dialog when same dialog without new entity ([52a1d4b](https://github.com/Botfuel/botfuel-dialog/commit/52a1d4b))
* retry entity extraction request 3 times when 503 error ([b03190e](https://github.com/Botfuel/botfuel-dialog/commit/b03190e))
* trigger the default dialog when the user trigger the same intent without new entity ([57d4e7a](https://github.com/Botfuel/botfuel-dialog/commit/57d4e7a))


### Features

* add a cancel-dialog with the associated en/fr views ([50a196a](https://github.com/Botfuel/botfuel-dialog/commit/50a196a))





<a name="11.4.0"></a>
# [11.4.0](https://github.com/Botfuel/botfuel-dialog/compare/v11.3.0...v11.4.0) (2018-09-17)


### Bug Fixes

* Allow spellchecking to be disabled ([e4070af](https://github.com/Botfuel/botfuel-dialog/commit/e4070af))
* Remove the need to specify a spellchecking key ([639332c](https://github.com/Botfuel/botfuel-dialog/commit/639332c))


### Features

* Pass userId to trainer classify ([a71a4bf](https://github.com/Botfuel/botfuel-dialog/commit/a71a4bf))





<a name="11.3.0"></a>
# [11.3.0](https://github.com/Botfuel/botfuel-dialog/compare/v11.2.0...v11.3.0) (2018-08-31)


### Bug Fixes

* Fix postback messages selection when using shell adapter ([b870596](https://github.com/Botfuel/botfuel-dialog/commit/b870596))


### Features

* trigger complex-input when text message is more than 256 chars ([5a4c25f](https://github.com/Botfuel/botfuel-dialog/commit/5a4c25f))





<a name="11.2.0"></a>
# [11.2.0](https://github.com/Botfuel/botfuel-dialog/compare/v11.1.2...v11.2.0) (2018-08-27)


### Features

* Pass dialog parameters to isFulfilled function ([92eb244](https://github.com/Botfuel/botfuel-dialog/commit/92eb244))





<a name="11.1.2"></a>
## [11.1.2](https://github.com/Botfuel/botfuel-dialog/compare/v11.1.1...v11.1.2) (2018-08-24)

**Note:** Version bump only for package botfuel-dialog





<a name="11.1.1"></a>
## [11.1.1](https://github.com/Botfuel/botfuel-dialog/compare/v11.1.0...v11.1.1) (2018-08-22)


### Bug Fixes

* fix conflicts with master ([8d4bba9](https://github.com/Botfuel/botfuel-dialog/commit/8d4bba9))
* fix style issues ([b26a530](https://github.com/Botfuel/botfuel-dialog/commit/b26a530))
* fix style issues ([1cedd9d](https://github.com/Botfuel/botfuel-dialog/commit/1cedd9d))





<a name="11.1.0"></a>
# [11.1.0](https://github.com/Botfuel/botfuel-dialog/compare/v11.0.0...v11.1.0) (2018-08-10)


### Bug Fixes

* Do not take values leading/trailing spaces into account in corpora ([2c0683b](https://github.com/Botfuel/botfuel-dialog/commit/2c0683b))


### Features

* return the original sentence when spellchecking error instead of triggering the catch-dialog, except if the error is due to authentication ([d5cf843](https://github.com/Botfuel/botfuel-dialog/commit/d5cf843))





<a name="11.0.0"></a>
# [11.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v10.0.2...v11.0.0) (2018-08-02)


### Bug Fixes

* restrict config access in resolvers ([6f88977](https://github.com/Botfuel/botfuel-dialog/commit/6f88977))
* Send error data properly to CatchDialog ([a0956d3](https://github.com/Botfuel/botfuel-dialog/commit/a0956d3))


### Features

* add custom property to Config type ([75129ba](https://github.com/Botfuel/botfuel-dialog/commit/75129ba))
* add pt_br in sdk ([5dc5dc9](https://github.com/Botfuel/botfuel-dialog/commit/5dc5dc9))
* allow access to config.custom property in a dialog via dialog.config ([8f271c4](https://github.com/Botfuel/botfuel-dialog/commit/8f271c4))
* change dialog and entities to dialogData ([59c9bb1](https://github.com/Botfuel/botfuel-dialog/commit/59c9bb1))
* postback fexible ([16293b2](https://github.com/Botfuel/botfuel-dialog/commit/16293b2))


### BREAKING CHANGES

* dialog and entities to dialogEntities
dialog and entities became dialogData in postback-message and postback 
the dialogData structure is : dialogData : { name: dialog, data: { messageEntities: entities}}





<a name="10.0.2"></a>
## [10.0.2](https://github.com/Botfuel/botfuel-dialog/compare/v10.0.1...v10.0.2) (2018-07-18)





<a name="10.0.1"></a>
## [10.0.1](https://github.com/Botfuel/botfuel-dialog/compare/v10.0.0...v10.0.1) (2018-07-18)

**Note:** Version bump only for package botfuel-dialog





<a name="10.0.0"></a>
# [10.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v9.0.3...v10.0.0) (2018-07-18)


### Bug Fixes

* Configure the spellchecking in the NLU section ([c1f889e](https://github.com/Botfuel/botfuel-dialog/commit/c1f889e))


### Features

* Catch dialog and view allow the bot to gracefully handle errors. ([792a597](https://github.com/Botfuel/botfuel-dialog/commit/792a597))


### BREAKING CHANGES

* The spellchecking is now configured in the NLU section.

<a name="9.0.4"></a>
## [9.0.4](https://github.com/Botfuel/botfuel-dialog/compare/v9.0.3...v9.0.4) (2018-07-17)

### BREAKING CHANGES

* Rename the method getLastConversation() to fetchLastConversation()

**Note:** Version bump only for package botfuel-dialog





<a name="9.0.3"></a>
## [9.0.3](https://github.com/Botfuel/bot-sdk2/compare/v9.0.2...v9.0.3) (2018-07-09)


### Bug Fixes

* Do not log unloggable context ([131137c](https://github.com/Botfuel/bot-sdk2/commit/131137c))





<a name="9.0.2"></a>
## [9.0.2](https://github.com/Botfuel/bot-sdk2/compare/v9.0.1...v9.0.2) (2018-07-09)


### Bug Fixes

* In classif filter, filter both qnas and intents ([1e76504](https://github.com/Botfuel/bot-sdk2/commit/1e76504))





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





<a name="8.3.0"></a>
# [8.3.0](https://github.com/Botfuel/botfuel-dialog/compare/v8.2.0...v8.3.0) (2018-07-03)


### Bug Fixes

* add missing property to Config type ([6c1a873](https://github.com/Botfuel/botfuel-dialog/commit/6c1a873))
* fix yarn.lock ([13375cc](https://github.com/Botfuel/botfuel-dialog/commit/13375cc))


### Features

* add key 'custom' to config whitelist ([6c731d8](https://github.com/Botfuel/botfuel-dialog/commit/6c731d8))





<a name="8.2.0"></a>
# [8.2.0](https://github.com/Botfuel/botfuel-dialog/compare/v8.1.1...v8.2.0) (2018-07-02)


### Features

* remove adapter Messenger. ([9bed673](https://github.com/Botfuel/botfuel-dialog/commit/9bed673))





<a name="8.1.1"></a>
## [8.1.1](https://github.com/Botfuel/botfuel-dialog/compare/v8.1.0...v8.1.1) (2018-06-26)


### Bug Fixes

* fix messenger bot when we have disambiguation view ([afabc20](https://github.com/Botfuel/botfuel-dialog/commit/afabc20))





<a name="8.1.0"></a>
# [8.1.0](https://github.com/Botfuel/botfuel-dialog/compare/v8.0.4...v8.1.0) (2018-06-15)


### Features

* Add complex input dialog & view ([b514ec3](https://github.com/Botfuel/botfuel-dialog/commit/b514ec3))





<a name="8.0.4"></a>
## [8.0.4](https://github.com/Botfuel/botfuel-dialog/compare/v8.0.3...v8.0.4) (2018-06-06)


### Bug Fixes

* Display intent label or qna title if resolve prompt is empty ([6d9046d](https://github.com/Botfuel/botfuel-dialog/commit/6d9046d))





<a name="8.0.3"></a>
## [8.0.3](https://github.com/Botfuel/botfuel-dialog/compare/v8.0.2...v8.0.3) (2018-05-23)


### Bug Fixes

* fix qna view when called by postback action ([7b227f1](https://github.com/Botfuel/botfuel-dialog/commit/7b227f1))





<a name="8.0.2"></a>
## [8.0.2](https://github.com/Botfuel/botfuel-dialog/compare/v8.0.1...v8.0.2) (2018-05-22)


### Bug Fixes

* fix QnA message after API updated ([a6cdfbc](https://github.com/Botfuel/botfuel-dialog/commit/a6cdfbc))





<a name="8.0.1"></a>
## [8.0.1](https://github.com/Botfuel/bot-sdk2/compare/v8.0.0...v8.0.1) (2018-05-22)

**Note:** Version bump only for package bot-sdk2





<a name="8.0.0"></a>
# [8.0.0](https://github.com/Botfuel/bot-sdk2/compare/v7.2.6...v8.0.0) (2018-05-22)


### Bug Fixes

* fix links to concepts and getting-started in new doc ([7db8e28](https://github.com/Botfuel/bot-sdk2/commit/7db8e28))
* fix test middlewares ([49861c5](https://github.com/Botfuel/bot-sdk2/commit/49861c5))


### Code Refactoring

* botfuel-nlu uses Botfuel Trainer ([c9cb226](https://github.com/Botfuel/bot-sdk2/commit/c9cb226))


### BREAKING CHANGES

* the nlu botfuel (default) will use Botfuel Trainer. Bots must be migrated to use Botfuel Trainer. No more intents folder and intents must be created inside the Botfuel Trainer.





<a name="7.2.6"></a>
## [7.2.6](https://github.com/Botfuel/botfuel-dialog/compare/v7.2.5...v7.2.6) (2018-05-18)


### Bug Fixes

* add manage error comma in Corpus ([bc5633e](https://github.com/Botfuel/botfuel-dialog/commit/bc5633e))





<a name="7.2.5"></a>
## [7.2.5](https://github.com/Botfuel/bot-sdk2/compare/v7.2.4...v7.2.5) (2018-05-17)


### Bug Fixes

* Process messenger events synchronously ([2b2d95a](https://github.com/Botfuel/bot-sdk2/commit/2b2d95a))





<a name="7.2.4"></a>
## [7.2.4](https://github.com/Botfuel/botfuel-dialog/compare/v7.2.3...v7.2.4) (2018-05-17)


### Bug Fixes

* error behavior prompt intent ([f559cbb](https://github.com/Botfuel/botfuel-dialog/commit/f559cbb))





<a name="7.2.3"></a>
## [7.2.3](https://github.com/Botfuel/botfuel-dialog/compare/v7.2.2...v7.2.3) (2018-05-16)


### Bug Fixes

* the bot should say when it doesn't understand a sentence ([3b69240](https://github.com/Botfuel/botfuel-dialog/commit/3b69240))





<a name="7.2.2"></a>
## [7.2.2](https://github.com/Botfuel/bot-sdk2/compare/v7.2.1...v7.2.2) (2018-05-15)


### Bug Fixes

* make build script cross platform ([37d1ef6](https://github.com/Botfuel/bot-sdk2/commit/37d1ef6))





<a name="7.2.1"></a>
## [7.2.1](https://github.com/Botfuel/bot-sdk2/compare/v7.2.0...v7.2.1) (2018-05-11)


### Bug Fixes

* Obfuscate BOTFUEL_APP_KEY in logs ([fd38026](https://github.com/Botfuel/bot-sdk2/commit/fd38026))
* remove '\r' in Windows intent files when creating model hash ([77ce413](https://github.com/Botfuel/bot-sdk2/commit/77ce413))
* remove \r introduce in Windows from corpus file ([03c9d64](https://github.com/Botfuel/bot-sdk2/commit/03c9d64))
* update trainer api call uri and add auth key and token ([f49d76f](https://github.com/Botfuel/bot-sdk2/commit/f49d76f))





<a name="7.2.0"></a>
# [7.2.0](https://github.com/Botfuel/botfuel-dialog/compare/v7.1.3...v7.2.0) (2018-05-09)


### Features

* support actions message in shell adapter ([8122d92](https://github.com/Botfuel/botfuel-dialog/commit/8122d92))





<a name="7.1.3"></a>
## [7.1.3](https://github.com/Botfuel/bot-sdk2/compare/v7.1.2...v7.1.3) (2018-05-03)


### Bug Fixes

* Add messaging_type in FB responses ([e9fedee](https://github.com/Botfuel/bot-sdk2/commit/e9fedee))
* Fix messenger adapter ([37a0948](https://github.com/Botfuel/bot-sdk2/commit/37a0948))





<a name="7.1.2"></a>
## [7.1.2](https://github.com/Botfuel/bot-sdk2/compare/v7.1.1...v7.1.2) (2018-05-02)

**Note:** Version bump only for package bot-sdk2





<a name="7.1.1"></a>
## [7.1.1](https://github.com/Botfuel/bot-sdk2/compare/v7.1.0...v7.1.1) (2018-05-02)

**Note:** Version bump only for package bot-sdk2





<a name="7.1.0"></a>
# [7.1.0](https://github.com/Botfuel/botfuel-dialog/compare/v7.0.1...v7.1.0) (2018-04-30)


### Bug Fixes

* get all users returns array not object ([988d7b3](https://github.com/Botfuel/botfuel-dialog/commit/988d7b3))


### Features

* added get all users method to brain ([308d086](https://github.com/Botfuel/botfuel-dialog/commit/308d086))





<a name="7.0.1"></a>
## [7.0.1](https://github.com/Botfuel/bot-sdk2/compare/v7.0.0...v7.0.1) (2018-04-25)

**Note:** Version bump only for package bot-sdk2





<a name="7.0.0"></a>
# [7.0.0](https://github.com/Botfuel/bot-sdk2/compare/v5.1.7...v7.0.0) (2018-04-18)


### Bug Fixes

* Fix merge config with default config ([6d9943c](https://github.com/Botfuel/bot-sdk2/commit/6d9943c))
* Apply breaking change on predefined dialogs ([988e025](https://github.com/Botfuel/bot-sdk2/commit/988e025))


### Code Refactoring

* Do not call adapters in dialogs ([656d884](https://github.com/Botfuel/bot-sdk2/commit/656d884))
* Do not pass brain and config to Dialog constructor ([b2eec6f](https://github.com/Botfuel/bot-sdk2/commit/b2eec6f))
* Pass bot messages by return value ([2501685](https://github.com/Botfuel/bot-sdk2/commit/2501685))


### BREAKING CHANGES

* Do not pass brain and config to Dialog
constructor because the bot is already passed.
  * Dialog.execute() returns an object with keys `action` and
`botMessages`.
  * Add new parameters `bot` of `Dialog` constructor
* Remove 1st paramters `adapter` of methods
`Dialog.execute()`, `Dialog.display()`





<a name="6.0.0"></a>
# [6.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v5.1.0...v6.0.0) (2018-04-17)


### BREAKING CHANGE

* Changed TextDialog to BaseDialog, and removed TextView. Now, if you would like to use a TextDialog, you use a BaseDialog instead, and if you would like to use a TextView, you use a general View instead (and you must implement render yourself. ([94a4763](https://github.com/Botfuel/botfuel-dialog/commit/94a4763))

* Change data structure in dialog: the data in dialog.execute function will contains all the necessary entities (like messageEntities, missingEntities, matchedEntities...) and possibly other keys from extraData ([4640b46](https://github.com/Botfuel/botfuel-dialog/commit/4640b46))


<a name="5.1.0"></a>
# [5.1.0](https://github.com/Botfuel/botfuel-dialog/compare/v5.0.0...v5.1.0) (2018-04-16)


### Bug Fixes

* Fix lerna run style ([b7206ea](https://github.com/Botfuel/botfuel-dialog/commit/b7206ea))
* fix tests after renaming botfuel-module-sample ([1448707](https://github.com/Botfuel/botfuel-dialog/commit/1448707))


### Features

* botfuel nlu use trainer api ([083f578](https://github.com/Botfuel/botfuel-dialog/commit/083f578))


<a name="5.0.0"></a>
# [5.0.0](https://github.com/Botfuel/botfuel-dialog/compare/v4.4.3...v5.0.0) (2018-04-03)


### Bug Fixes

* correct style ([b04114b](https://github.com/Botfuel/botfuel-dialog/commit/b04114b))
* fix style ([6671e78](https://github.com/Botfuel/botfuel-dialog/commit/6671e78))
* fix style ([3108976](https://github.com/Botfuel/botfuel-dialog/commit/3108976))
* remove undefined value in matchedEntities object ([8f9555d](https://github.com/Botfuel/botfuel-dialog/commit/8f9555d))


### BREAKING CHANGES

* Store prompt dialog in brain with new strucutre {entities: ..., question:...}, this can cause conflict on running bot with MongoBrain ([599b8c8](https://github.com/Botfuel/botfuel-dialog/commit/599b8c8))
* `missingEntities` is now a Map instead of a plain Object


<a name="4.4.3"></a>
## [4.4.3](https://github.com/Botfuel/botfuel-dialog/compare/v4.4.2...v4.4.3) (2018-03-29)


### Bug Fixes

* fix style ([4f91f3e](https://github.com/Botfuel/botfuel-dialog/commit/4f91f3e))
* send question for entity with highest priority first in prompt-view ([7a4a99e](https://github.com/Botfuel/botfuel-dialog/commit/7a4a99e))



<a name="4.4.2"></a>
## [4.4.2](https://github.com/Botfuel/botfuel-dialog/compare/v4.4.1...v4.4.2) (2018-03-26)


### Features

* add LocationExtractor and use it in Botfuel NLU
* add 'system:entity' entity

### Bug Fixes

* pass url value instead of payload containing url in MessengerAdapter for UserImageMessage




**Note:** Version bump only for package undefined

<a name="4.4.1"></a>
## [4.4.1](https://github.com/Botfuel/botfuel-dialog/compare/v4.4.0...v4.4.1) (2018-03-23)


### Bug fixes

* export Message class ([f69c162](https://github.com/Botfuel/botfuel-dialog/commit/f69c162))




<a name="4.4.0"></a>
# [4.4.0](https://github.com/Botfuel/botfuel-dialog/compare/v4.3.4...v4.4.0) (2018-03-22)


### Features

* add BotTableMessage ([eb7b44a](https://github.com/Botfuel/botfuel-dialog/commit/eb7b44a))




<a name="4.3.4"></a>
## [4.3.4](https://github.com/Botfuel/botfuel-dialog/compare/v4.3.1...v4.3.4) (2018-03-22)


### Features

* add RegexExtractor ([59d0a60](https://github.com/Botfuel/botfuel-dialog/commit/59d0a60))




<a name="4.3.1"></a>
## [4.3.1](https://github.com/Botfuel/botfuel-dialog/compare/v4.3.0...v4.3.1) (2018-03-20)


### Bug Fixes

* update contributtion for publish ([044ff14](https://github.com/Botfuel/botfuel-dialog/commit/044ff14))
* exporting extractor ([32ff36db](https://github.com/Botfuel/botfuel-dialog/commit/32ff36db))



<a name="4.3.0"></a>
# [4.3.0](https://github.com/Botfuel/botfuel-dialog/compare/v4.2.0...v4.3.0) (2018-03-16)


### Bug Fixes

* change import order ([aa02962](https://github.com/Botfuel/botfuel-dialog/commit/aa02962))
* set quality of image screenshot default value to 80 ([535dfc0](https://github.com/Botfuel/botfuel-dialog/commit/535dfc0))
* Update test ecommerce to use local images and update unittests ([1f68fc7](https://github.com/Botfuel/botfuel-dialog/commit/1f68fc7))


### Features

* add example for using handlebars templates and image generation ([2c78d55](https://github.com/Botfuel/botfuel-dialog/commit/2c78d55))
* Implement methods to get static and template, tempate image ([bfa015f](https://github.com/Botfuel/botfuel-dialog/commit/bfa015f))





<a name="4.2.0"></a>
# [4.2.0](https://github.com/Botfuel/bot-sdk2/compare/v4.1.0...v4.2.0) (2018-03-12)


### Features

* expose MissingImplementationError ([5755bd5](https://github.com/Botfuel/bot-sdk2/commit/5755bd5))
* Support modules ([ecab4eb](https://github.com/Botfuel/bot-sdk2/commit/ecab4eb))





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
