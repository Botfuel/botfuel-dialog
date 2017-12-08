# Concepts
This document explains how a bot works and what the underlying concepts are.

The purpose of a bot is to exchange messages with a user.
A user message is processed by the bot which computes responses (bot messages).
The processing of the user message and the generation of the bot messages are performed by several components.

## Components
A bot is composed of differents components:
- a nlu component, it is used to process user text messages,
- a dialog manager, it decides which dialogs to call,
- a brain, it stores things,
- adapters, they adapt the messages to the messaging platform,
- dialogs, they interact with the brain and the views
- views, they generate the messages,
- extractors, they extract entities from user sentences.

Let's see how these components interact with a [sequence diagram](https://en.wikipedia.org/wiki/Sequence_diagram):

```
  Adapter        Bot          Nlu       Extractor  DialogManager    Brain       Dialog        View
  -------        ---          ---       ---------  -------------    -----       ------        ----
---> |            |            |            |            |            |            |            |
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
<--- |            |            |            |            |            |            |            |
```

### MVC
The bot implements the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern where:
- the brain is the _model_ : it contains all the information about the bot, the users, the conversations,
- the dialog is the _controller_ : it updates the brain and calls its view with the required parameters,
- the _view_ generates the messages to be sent to the user.

## Messages
The SDK defines its own message format and supports:
- text messages,
- images and image uploads,
- links,
- buttons and postbacks,
- quick replies,
- complex messages such as carrousels.

A message has the form:
```javacript
{
  type: '<message type>',
  sender: '<bot or user>',
  bot: '<bot id>',
  user: '<user id>',
  payload: {
    value: '<the value>',
    options: '<the options>'
  }
}
```

## Adapters
Each messaging platform (Messenger, ...) has its own message format.
It is the responsibility of the adapters to translate external formats into the SDK's message format.

The SDK comes with the following adapters:
- _messenger_, an adapter for Facebook's messaging platform,
- _botfuel_, an adapter for Botfuel's webchat,
- _shell_, an adapter for running a bot in a shell,
- _test_, a test adapter for running tests.

### Test adapter
The test adapter allows to easily run tests.
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
The nlu
([Natural Language Understanding](https://en.wikipedia.org/wiki/Natural_language_understanding))
module is responsible for computing intents and entities from a user text message
(which mainly contains a sentence).

### Intents
Given a sentence, the nlu module computes a list of user intents with their probabilities.
The actual computation is performed by a classifier.

The classifier builds a classification model based on a training set which takes the form of a set of `.intent` files.
Here is an example of an intent file:
```
I want to eat!
I am hungry.
Give me food!
```

### Entities
Given a sentence, the nlu module computes a list of entities.
The actual computation is performed by extractors.

An extracted entity comes with the following details:
```javascript
{
  dim: '<the dimension>',
  body: '<the substring>',
  values: [
    {
      type: '<the type>',
      '<depends on the type of value>',
    }
  ],
  start: '<the start index of the extracted substring>',
  end: '<the end index of the extracted substring>'
}
```

## Extractors
The SDK allows to use two types of extractors:
- extractors using Botfuel's entity extraction web service (see https://app.botfuel.io),
- corpus based extractors.

## Dialog Manager
The dialog manager is responsible to choose which dialog to call.
The dialog manager allows to handle complex conversations, including:
- digressions,
- multi-intents,
- [random access navigation](https://medium.com/assist/theres-a-dozen-ways-to-order-a-coffee-why-do-dumb-bots-only-allow-one-27230542636d).

## Brains
The brain is the _model_ of a bot.
The SDK offers different brain implementations:
- an in-memory brain,
- a [MongoDb](https://www.mongodb.com) based brain.

It is very easy to write a new brain implementation.

## Dialogs
Dialogs are the _controllers_ of the bot.
They are responsible for reading from/writing to the brain and for calling their view with the correct parameters.

The SDK offers several dialogs:
- a `TextDialog` for simple text messages,
- a `PromptDialog` which prompts the user for inputs,
- a `QnaDialog` which answers questions using Botfuel's QnA service (see https://app.botfuel.io).

## Views
Each dialog comes with a single view.
The view is responsible for generating the bot messages.

A view can have different sections, those are identified with a key.
