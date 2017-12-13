# Concepts
This document explains how a bot works as well as the underlying concepts.

The purpose of a bot is to exchange messages with a user.
A user message is processed by the bot that computes responses (bot messages).

## Bot
A bot is an application composed of the following main parts:
- Adapter, adapt the messages to the messaging platform
- NLU (Natural Language Understanding) component, processes user text messages
- Dialog Manager, decides which dialogs to call
- Brain, stores values relevant to the operation of the bot

### Other components
The processing of the user message and the generation of the bot messages involve additional components:
- Extractors, extract entities from user sentences
- Dialogs, interact with the brain and the views
- Views, generate the messages

You can see how these components interact in this diagram:
![Diagram explaining the concepts](concepts-diagram.jpg)

### MVC
Note that the bot implements the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern where:
- Brain is the _model_, it contains all the information about the bot, the users, the conversations
- Dialog is the _controller_, it updates the brain and calls its view with the required parameters
- _View_ generates the messages to be sent to the user

## Adapters
Each messaging platform (e.g., Facebook Messenger) has its own message format.
The adapters are responsible for translating external formats into the SDK's message format and vice-versa.

The SDK comes with the following adapters:
- _messenger_, an adapter for Facebook Messenger
- _botfuel_, an adapter for Botfuel's webchat
- _shell_, an adapter for running a bot in a shell
- _test_, a test adapter for running tests

It is very easy to develop a new adapter. One just need to implement the `Adapter` abstract class.

Let's have a look at two specific adapters that play a special role in bots development.

### Shell adapter ###
The shell adapter allows you to run a bot in a shell, which is handy for debugging purposes.
The following command runs a bot in a shell:
```
BOT_ID=<the bot id> BOTFUEL_APP_ID=<the app id> BOTFUEL_APP_KEY=<the app key> ./node_modules/.bin/botfuel-run <an optional configuration file>
```

### Test adapter
The test adapter allows you to easily run tests.
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
```
See the [sample bots](https://github.com/topics/bot-sdk2-samples) for more examples of tests.

## NLU
User messages often contain text, such asa sentence.
Note that a user message can also be:
- Click on a button
- Upload (e.g., of an image)
- Geolocation

When the  message is a text, the NLU
([Natural Language Understanding](https://en.wikipedia.org/wiki/Natural_language_understanding))
module is responsible for computing intents and entities from this sentence.

### Intents and classification
Given a sentence, it is key to understand the user intention or intent.
Look at the following example:
```
I want to buy shoes!
```
In this case, the intent could be `buy-shoes`.

Note that a sentence can express more than one intent, as in:
```
Thank you, I want to buy shoes!
```
In this new example, the intents are `thanks` and `buy-shoes`.

Given a sentence, the NLU module computes a list of user intents with their probabilities.
The actual computation is performed by a classifier that is a part of the NLU module (we will see later on that the NLU module has other parts).

The classifier builds a classification model based on a training set that takes the form of a set of `.intent` files.
Here is an example of an `buy-shoes.intent` intent file well suited for the `buy-shoes` intent:
```
I want to buy shoes!
I need some new shoes.
Show me some nice shoes!
```

### Named entities and extractors
In order to understand the meaning of a sentence, it is also key to be able to extract [named entities](https://en.wikipedia.org/wiki/Named_entity).

Given a sentence, the NLU module computes a list of named entities.
The actual computation is performed by extractors that form another part of the NLU module (the first one being the classifier).

The SDK allows to use two types of extractors:
- Extractors based on Botfuel's entity extraction web service, this web service covers 31 named entities such as dates, addresses, durations, quantities
(see https://app.botfuel.io/docs/#entity-extraction for more details about the web service and the entities supported)
- Corpus-based extractors, for user defined named entities (useful if you plan to integrate industry-specific knowledge into your bot)

See the [sample bots](https://github.com/topics/bot-sdk2-samples) for examples of corpus-based extractors.

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

### Resolution strategy
The dialog manager locates the dialog with a given name in the following order, moving to the next location if the dialog is not found:
- In the bot, looking for `<dialog name>.<adapter>.js`
- In the bot, looking for `<dialog name>.js`
- In the SDK, looking for `<dialog name>.<adapter>.js`
- In the SDK, looking for `<dialog name>.js`

This allows to the bot developer to customize the behavior of the bot depending on the adapter.
It also allows for default dialog implementations in the SDK.

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

> _Bot_: You are welcome. Where do yo go?

#### Random access navigation
> _User_: I want to go to Paris next Monday

> _Bot_: You are leaving Monday from Paris. Where do you leave from?

> _User_: **Actually, I am leaving next Tuesday**

> _Bot_: You are leaving Tuesday. Where do you leave from?

## Dialogs
From an MVC perspective, dialogs are the _controllers_ of the bot.
A dialog interact with the brain (reads and writes),
does some computations (e.g., by calling external APIs)
and calls its view with the required parameters.
Note that a dialog has a single view, the name of the dialog and the name of its view are the same.

### Resolution strategy
The dialog locates its view in the following specific order, moving to the next location if the view is not found:
- In the bot, looking for `<view name>.<locale>.js`
- In the bot, looking for `<view name>.js`
- In the SDK, looking for `<view name>.<locale>.js`
- In the SDK, looking for `<view name>.js`

This allows to customize the rendering depending on the locale.
It also for default view implementations in the SDK.

### Built-in dialogs
The SDK offers several built-in dialogs:
- `TextDialog` for simple text messages
- `ConfirmationDialog` for dialog confirmation
- `PromptDialog` that prompts the user for inputs
- `QnaDialog` that answers questions using Botfuel's QnA service (see https://app.botfuel.io/docs#qna)

It is very easy to write new dialog types to implement custom logic.

#### PromptDialog
The `PromptDialog` class allows you to prompt the user for entities.
You can override the `dialogWillComplete` method
to perform some actions when all required entities have been extracted.

### Dialog instructions
Dialogs come with a set of powerful instructions:
- `complete` indicates that the dialog is complete and should let the dialog execute other dialogs
- `wait` indicates that user input is required for continuing execution of the dialog
- `triggerNext` is used for chaining dialogs
- `cancelPrevious` is used for cancelling the previous dialog

See the [sample bots](https://github.com/topics/bot-sdk2-samples) for examples of use of these instructions.


## Views
Each dialog comes with a single view.
The view is responsible for generating the bot messages depending on the parameters passed by its dialog.
The view should not contain complex logic.

### Messages
Views generate messages.
The SDK defines its own message format so that you can easily develop multi-channel bots, it supports:
- Text messages and quick replies
- Images and image uploads
- Links
- Buttons and clicks on buttons (aka postbacks)
- Complex messages such as carousels

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

### Built-in views
The SDK offers several built-in views:
- `TextView` for simple text messages
- `ConfirmationView` for dialog confirmation
- `PromptView` that prompts the user for inputs
- `QnaView` that answers questions using Botfuel's QnA service (see https://app.botfuel.io/docs#qna)

#### TextView
The `TextView` class offers an easy way to display text.
Simply subclass it and override the `getTexts` method to return an array of texts.

## Brain
From an MVC perspective, the brain is the _model_ of a bot.
A brain is needed to persist information between two user messages.

The SDK offers different brain implementations:
- In-memory brain
- [MongoDb](https://www.mongodb.com)-based brain

If you plan to deploy your bot on more than a single machine, then you need a brain which is shareable like the MongoDb-based brain.

It is very easy to write a new brain implementation.
One just need to implement the `Brain` abstract class.
