By the end of this this tutorial, you will be able to have a bot running that is able to respond to a greeting and ask for your name. You will also add a new functionality that will make the bot ask for your age.

# Getting API credentials

## Creating a Botfuel Developer Account

You can use the SDK without any API credentials, but in this tutorial we want to take advantage of the entity extraction service.
To get API crendentialsl you need to create a Botfuel developer account. The Labs plan is free up to 5000 API calls per month!

If you haven’t already, visit the [Botfuel Developer Portal](https://app.botfuel.io/) and create an account:

<img src="https://s3.eu-west-1.amazonaws.com/botfuel-docs/screenshots/signup.png" alt="Sign up" width="300"/>

## Creating an app

Once you have created an account and are logged in, create an app by clicling on the `New app` button:

<img src="https://s3.eu-west-1.amazonaws.com/botfuel-docs/screenshots/createapp.png" alt="Creating an app" width="800"/>

Now give a name to your app, an optional description and a language.

The app’s language determines what language your bot will understand. Under the hood, our NLP APIs behave differently based on the language you choose. You won’t be able to change it later so choose carefully!

<img src="https://s3.eu-west-1.amazonaws.com/botfuel-docs/screenshots/createapp2.png" alt="Creating an app 2" width="800"/>

## Getting the credentials

Once your app is created, make sure you locate the `Credentials` section. We will use the App Id and App Key parameters later in this tutorial.

<img src="https://s3.eu-west-1.amazonaws.com/botfuel-docs/screenshots/credentials.png" alt="Credentials" width="800"/>

# Installation

Open a terminal and clone the sample starter bot:

```shell
git clone git@github.com:Botfuel/sample-bot-starter.git
```

Install dependencies:

```shell
cd sample-bot-starter
npm install
```

Start the bot with the `BOTFUEL_APP_ID` and `BOTFUEL_APP_KEY` environment variables using your app’s credentials:

```shell
BOT_ID BOTFUEL_APP_ID=<YOUR_BOTFUEL_APP_ID> BOTFUEL_APP_KEY=<YOUR_BOTFUEL_APP_KEY> npm start
```

If you set your app credentials right, you should see:

```shell
2017-12-07T16:12:09.131Z - info: [Bot] BOT_ID starter
2017-12-07T16:12:09.133Z - info: [Bot] BOTFUEL_APP_ID <YOUR_BOTFUEL_APP_ID>
2017-12-07T16:12:09.133Z - info: [Bot] BOTFUEL_APP_KEY <YOUR_BOTFUEL_APP_KEY>
> onboarding
```

Your bot is now running, congratulations!

# Basics

Right now, your bot has 2 basic intents:

- Greetings: if you say hello, it will simply reply with `Hello human!`
- Name: if you say `My name is bob` it will reply with `So your name is Bob... Hello Bob!`

A bot has 4 basic building blocks:

- Intents: text files that contain examples of sentences that are used in training to trigger a Dialog,
- Extractors: extract entities (e.g. forename, number, color, city...) that can then be used by the bot,
- Dialogs: controllers that specify what user input is needed to respond. Interact with the brain and compute the data (e.g entities, plain text) that will passed to the corresponding View,
- Views: generate the bot messages.

Let’s illustrate this using the `Name` functionality:

| Block | What it does | File
| --- | --- | --- |
| Intent | Matches user input (`My name is bob` for example) with the `name` intent | `src/intents/name.intent`
| Extractor | Extracts the forename `bob` from the user sentence | `src/extractors/forename-extractor.js`
| Dialog | Specifies it needs a `forename` entity named `name` | `src/dialogs/name-dialog.js`
| View | Replies with the recognized name | `src/views/name-view.js`

# Adding a functionality

Let’s add the age functionality. What we’d like:

- User says something like: `I am <AGE>` or `<AGE> years old`
- Bot replies:
  - `<AGE>! You’re older than me.` if <AGE> > 50
  - `<AGE>... You’re younger than me.` if <AGE> < 50
  - `<AGE>. You’re as old as I am!` if <AGE> === 50

## Adding the age Intent

First let’s create the `age` intent.
Create a `age.intent` file in the `src/intents` directory with:

```
I am 42 years old.
I am 42.
42 years old.
Ask me about my age.
``
as its content.

The more sentences you add, the more likely your bot will be able to understand and match a user input.

Run this command to check the contents of your new intent:

```shell
less src/intents/age.intent
```

This should display:

```
I am 42 years old.
I am 42.
42 years old.
Ask me about my age.
```

In your terminal, execute the following command:

```shell
npm run train
```

This will update the model to include your new model. Be sure to train each time you add, remove or change an intent.

## Adding the number Extractor

Create a `number-extractor.js` file in the `src/extractors` directory so that the bot can extract numbers from user input.

```javascript
const sdk2 = require('@botfuel/bot-sdk2');

class NumberExtractor extends sdk2.WsExtractor {}

NumberExtractor.params = {
  dimensions: ['number'],
};

module.exports = NumberExtractor;
```

## Adding the age Dialog

Create a `age-dialog.js` file in the `src/dialogs` directory.
Because it needs user input to reply, the age Dialog is a PromptDialog:

```javascript
const sdk2 = require('@botfuel/bot-sdk2');

class Age extends sdk2.PromptDialog {}

Age.params = {
  namespace: 'age',
  entities: {
    age: {
      dim: 'number',
    },
  },
};

module.exports = Age;
```

Here we say that the age Dialog needs an entity named `age` that is a `number`.

## Adding the age View

Create a `age-view.js` file in the `src/views` directory.
Since the age Dialog is a `PromptDialog`, the age View needs to be a `PromptView` so it can access the `age` entity in the `renderEntities` method:

```javascript
const { PromptView, Messages: { BotTextMessage } } = require('@botfuel/bot-sdk2');

class AgeView extends PromptView {
  renderEntities(matchedEntities) {
    const age = matchedEntities.age && matchedEntities.age.values[0].value;

    if (!age) {
        return [new BotTextMessage('Can you tell me your age?')];
    }

    if (age > 50) {
        return [new BotTextMessage(`${age}! You’re older than me`)];
    }

    if (age === 50) {
        return [new BotTextMessage(`${age}! You’re as old as I am!`)];
    }
    
    return [new BotTextMessage(`${age}... You’re younger than me.`)];
  }
}

module.exports = AgeView;
```

Here we return different messages based on the value of the `age` extracted. If no value was successfully extracted, we reply with `Can you tell me your age?`.

## Try it out

Run your bot with:

shell
```shell
BOTFUEL_APP_ID=<YOUR_BOTFUEL_APP_ID> BOTFUEL_APP_KEY=<YOUR_BOTFUEL_APP_KEY> npm start
```

Try and see what your bot thinks about your age!

If you have any issue or question about this tutorial, feel free to open an issue [here](https://github.com/Botfuel/sample-bot-starter/issues).
