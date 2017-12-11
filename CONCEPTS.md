# Concepts
This document explains how a bot works as well as the underlying concepts.

The purpose of a bot is to exchange messages with a user.
A user message is processed by the bot that computes responses (bot messages).
The processing of the user message and the generation of the bot messages are performed by several components.

## Components
A bot is composed of the following components:
- Adapters, adapt the messages to the messaging platform
- NLU (Natural Language Understanding) component, processes user text messages
- Extractors, extract entities from user sentences
- Dialog Manager, decides which dialogs to call
- Dialogs, interact with the brain and the views
- Views, generate the messages
- Brain, stores values relevant to the operation of the bot

You can see how these components interact in this [sequence diagram](https://en.wikipedia.org/wiki/Sequence_diagram):

```
             Adapter       Bot         NLU      Extractor   DialogMgr     Brain      Dialog       View
             -------       ---         ---      ---------   ---------     -----      ------       ----
-- user msg --> |           |           |           |           |           |           |           |
                | --------> |           |           |           |           |           |           |
                |           | --------> |           |           |           |           |           |
                |           |           | --------> |           |           |           |           |
                |           |           | <-------- |           |           |           |           |
                |           | <-------- |           |           |           |           |           |
                |           | ----------|-----------|---------> |           |           |           |
                |           |           |           |           | --------> |           |           |
                |           |           |           |           | <-------- |           |           |
                |           |           |           |           | ----------|---------> |           |
                |           |           |           |           |           | <-------- |           |
                |           |           |           |           |           | --------> |           |
                |           |           |           |           |           |           | --------> |
                |           |           |           |           |           |           | <-------- |
                | <---------|-----------|-----------|-----------|-----------|---------- |           |
<-- bot msgs -- |           |           |           |           |           |           |           |
```

### MVC
The bot implements the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern where:
- the brain is the _model_ : it contains all the information about the bot, the users, the conversations
- the dialog is the _controller_ : it updates the brain and calls its view with the required parameters
- the _view_ generates the messages to be sent to the user

## Messages
The SDK defines its own message format which supports:
- Text messages and quick replies
- Images and image uploads
- Links
- Buttons and clicks on buttons (aka postbacks)
- Complex messages such as carrousels

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
Each messaging platform (e.g. Facebook Messenger) has its own message format.
The adapters are responsible for translating external formats into the SDK's message format.

The SDK comes with the following adapters:
- _messenger_, an adapter for Facebook Messenger
- _botfuel_, an adapter for Botfuel's webchat
- _shell_, an adapter for running a bot in a shell
- _test_, a test adapter for running tests

It is very easy to developer a new adapter. One just need to implement the `Adapter` abstract class.

Let's have a look at two specific adapters which play a special role in bots development.

### Shell adapter ###
The shell adapter allows to run a bot in a shell which is handy for debugging purpose.
The following command allows to run a bot in a shell:
```
BOT_ID=<the bot id> BOTFUEL_APP_ID=<the app id> BOTFUEL_APP_KEY=<the app key> ./node_modules/.bin/botfuel-run <an optional configuration file>
```

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
See the [sample bots](https://github.com/Botfuel/bot-sdk2/blob/master/SAMPLES.txt) for more examples of tests.

## NLU
User message often contain a sentence.
Note that a user message can also be:
- a click on a button
- an upload (e.g. of an image)
- a geolocation

In the case of the user message is a text message, and thus contains a sentence, the NLU
([Natural Language Understanding](https://en.wikipedia.org/wiki/Natural_language_understanding))
module is responsible for computing intents and entities from this sentence.

### Intents and classification
Given a sentence, it is key to understand the user intention or intent.
Look at the following example:
```
I want to eat!
```
In this case, the intent could be `hungry`.

Note that a sentence can express more than one intent, like in:
```
Thank you, I want to eat!
```
In this new example, the intents would be `thanks` and `hungry`.

Given a sentence, the NLU module computes a list of user intents with their probabilities.
The actual computation is performed by a classifier which is a part of the NLU module (we will see later on that the NLU module has other parts).

The classifier builds a classification model based on a training set which takes the form of a set of `.intent` files.
Here is an example of an `hungry.intent` intent file well suited for of `hungry` intent:
```
I want to eat!
I am hungry.
Give me food!
```

### Named entities and extractors
In order to understand the meaning of a sentence, it is also key to be able to extract [named entities](https://en.wikipedia.org/wiki/Named_entity).

Given a sentence, the NLU module computes a list of named entities.
The actual computation is performed by extractors which form another part of the NLU module (the first one being the classifier).

The SDK allows to use two types of extractors:
- Extractors based on Botfuel's entity extraction web service, this web service covers 31 named entities such as dates, addresses, durations, quantities
(see https://app.botfuel.io/docs/#entity-extraction for more details about the web service and the entities supported)
- Corpus based extractors, for user defined named entities (useful if you plan to integrate industry specific knowledge to your bot)

See the [sample bots](https://github.com/Botfuel/bot-sdk2/blob/master/SAMPLES.txt) for examples of corpus based extractors.

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

## Dialog Manager
The dialog manager is responsible for choosing which dialog to call.
In the case where an intent has been classified, the dialog manager will try to find a dialog with the same name.

### Complex conversations
The dialog manager enables complex conversations, including:
- Digressions
- Multi-intents
- [Random access navigation](https://medium.com/assist/theres-a-dozen-ways-to-order-a-coffee-why-do-dumb-bots-only-allow-one-27230542636d)

Let's illustrate different examples of complex conversation.

#### Digressions
> _User_: I want to go to Paris

> _Bot_: You go to Paris. When do you leave?

> _User_: **BTW, what's the weather in Paris this week**

> _Bot_: Cloudy

> _Bot_: When do you leave?

> _User_: I'll leave next week then

#### Multi-intents
> _User_: I want to cancel my plane ticket

> _Bot_: Ticket cancelled, anything else?

> _User_: **Thank you, I'd like to book a train ticket**

#### Random access navigation
> _User_: I want to go to Paris next Monday

> _Bot_: You are leaving Monday from Paris. Where do you leave from?

> _User_: **Actually, I am leaving next Tuesday**

> _Bot_: You are leaving Tuesday. Where do you leave from?

## Dialogs
Dialogs are the _controllers_ of the bot.
A dialog has a single view, the name of the dialog and the name its view are the same.

Dialogs are responsible:
- for reading from/writing to the brain,
- for calling external APIs and
- for dispatching to their view with the correct parameters.

### Resolution strategy
The strategy for finding the dialog with a given name is the following:
- The dialog manager first looks in the bot for the dialog file `<dialog name>.<adapter>.js`
- If it does not exist, it looks in the bot for the dialog file `<dialog name>.js`
- If it does not exist, it looks in the SDK for the dialog file `<dialog name>.<adapter>.js`
- If it does not exist, it looks in the SDK for the dialog file `<dialog name>.js`

This allows to customize the behaviour of the bot depending on the adapter.
It also allows to provide default dialog implementations in the SDK.

### Built-in dialogs
The SDK offers several built-in dialogs:
- `TextDialog` for simple text messages
- `PromptDialog` which prompts the user for inputs
- `QnaDialog` which answers questions using Botfuel's QnA service (see https://app.botfuel.io/docs#qna)

## Views
Each dialog comes with a single view.
The view is responsible for generating the bot messages.

A view can have different sections, those are identified with a key.

### Resolution strategy
The strategy for finding the view with a given name is the following:
- The dialog first looks in the bot for the view file `<view name>.<locale>.js`
- If it does not exist, it looks in the bot for the view file `<view name>.js`
- If it does not exist, it looks in the SDK for the view file `<view name>.<locale>.js`
- If it does not exist, it looks in the SDK for the view file `<view name>.js`

This allows to customize the rendering depending on the locale.
It also allows to provide default view implementations in the SDK.

### Built-in views
The SDK offers several built-in views:
- `TextView` for simple text messages
- `PromptView` which prompts the user for inputs
- `QnaView` which answers questions using Botfuel's QnA service (see https://app.botfuel.io/docs#qna)

## Brains
The brain is the _model_ of a bot.
The SDK offers different brain implementations:
- In-memory brain
- [MongoDb](https://www.mongodb.com) based brain

It is very easy to write a new brain implementation.
One just need to implement the `Brain` abstract class.
