# Concepts

This document explains how a bot works and what the underlying concepts are.

The purpose of a bot is to exchange messages with a user.
A user message is processed by the bot which computes responses (bot messages).
The processing of the user message and the generation of the bot messages are performed by several components.

## Components

A bot is composed of differents components:
- a nlu ([Natural Language Understanding](https://en.wikipedia.org/wiki/Natural_language_understanding)) component, it is used to process user text messages,
- a dialog manager, it decides which dialogs to call,
- a brain, it stores things,
- adapters, they adapt the messages to the messaging platform,
- dialogs, they interact with the brain and the views
- views, they generate the messages,
- extractors, they extract entities from user sentences.

Let's see how these components interact with a sequence diagram:

```
         Adapter        Bot          Nlu       Extractor  DialogManager    Brain       Dialog        View
         -------        ---          ---       ---------  -------------    -----       ------        ----
            |            |            |            |            |            |            |            |
            | ---------> |            |            |            |            |            |            |
            |            | ---------> |            |            |            |            |            |
            |            |            | ---------> |            |            |            |            |
            |            |            | <--------- |            |            |            |            |
            |            | <--------- |            |            |            |            |            |
            |            | -----------|------------|----------> |            |            |            |
            |            |            |            |            | ---------> |            |            |
            |            |            |            |            | <--------- |            |            |
            |            |            |            |            | -----------|----------> |            |
            |            |            |            |            |            | <--------- |            |
            |            |            |            |            |            | ---------> |            |
            |            |            |            |            |            |            | ---------> |
            |            |            |            |            |            |            | <--------- |
            | <----------|------------|------------|------------|------------|----------- |            |
            |            |            |            |            |            |            |            |
```

Note:
The bot implements the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern where:
- the brain is the model : it contains all the information about the bot, the users, the conversations,
- the dialog is the controller : it updates the brain and calls its view with the required parameters,
- the view generates the messages to be sent to the user.

## Messages
The SDK defines its own message format and supports:
- text messages,
- images and image uploads,
- links,
- buttons and postbacks,
- quick replies,
- complex messages such as carrousels.

## Adapters
Each messaging platform (Messenger, ...) has its own message format.
It is the responsibility of the adapters to translate external formats into the SDK's message format.

The SDK comes with the following adapters:
- messenger, an adapter for Facebook's messaging platform,
- botfuel, an adapter for Botfuel's webchat,
- shell, an adapter for running a bot in a shell,
- test, a test adapter for running tests.

### Test adapter
Here is the code of a simple test:
```javascript
const config = require('../test-config');

const bot = new Bot(config);

await bot.play([
  new UserTextMessage('Hello!'),
]);

const userId = bot.adapter.userId;
expect(bot.adapter.log).to.eql([
  new UserTextMessage('Hello!'),
  new BotTextMessage('Hello human.'),
].map(msg => msg.toJson(bot.id, userId)));

const user = await bot.brain.getUser(userId);
expect(user.conversations.length).to.be(1);
```
See the sample bots on [Github](https://github.com/Botfuel) for more examples of tests.

## Nlu

## Extractors

## Dialog Manager

## Dialogs

## Brains
(the SDK offers different brain implementations)

## Views
