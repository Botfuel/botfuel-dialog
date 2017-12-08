# Getting API credentials

## Creating a Botfuel Developer Account

If you haven’t already, visit the [Botfuel Developer Portal](https://app.botfuel.io/) and create an account:

<img src="https://s3.eu-west-1.amazonaws.com/botfuel-docs/screenshots/signup.png" alt="Sign up" width="300"/>

A Botfuel developer account and app are needed because our SDK internally uses our Natural Language Processing (NLP) APIs which are authenticated and limited in calls depending on your app’s plan. The Labs plan is free up to 5000 API calls per month!

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

Open a terminal and clone the bot sample starter:

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
BOTFUEL_APP_ID=<YOUR_BOTFUEL_APP_ID> BOTFUEL_APP_KEY=<YOUR_BOTFUEL_APP_KEY> npm start
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

Right now, your bot has 2 basic features:

- Greetings: if you say hello, it will simply reply with `Hello human!`
- Name: if you say `My name is bob` it will reply with `So your name is Bob... Hello Bob!`

A bot has 4 basic building blocs:

- Intents: text file that contains sentences that should be recognised to trigger a Dialog
- Extractors: determines what entities (forename, number, color, city...) can be extracted by the bot.
- Dialogs: specifies what data (API call, entities, plain text) should be used in the corresponding View
- Views: what should the bot display as a reply

Let’s illustrate this using the `Name` feature:

| Block | Example | File
| --- | --- | --- |
| Intent | the sentence `My name is bob` is matched with the `name` intent | `src/intents/name.intent`
| Extractor | extracts the forename `bob` from the user sentence | `src/extractors/forename-extractor.js`
| Dialog | Specifies it needs a `forename` entity named `name` | `src/dialogs/name-dialog.js`
| View | Replies with the recognised name | `src/views/name-view.js`

# Adding a feature

Let’s add the age feature. What we’d like:

- User says: `I am <AGE> years old`
- Bot replies:
  - `<AGE>! You’re pretty old.` if <AGE> > 50
  - `<AGE>... I could be your dad!` if <AGE> <= 50

## Adding the age Intent

First let’s create the `age` intent.
Create a `age.intent` file in the `src/intents` directory with `I am 42 years old.` as its content.

In your terminal, execute the following command:

```shell
npm run train
```

This will update the model to include your new model. Be sure to train each time you add, remove or change an intent.

## Adding the number Extractor

Create a `number-extractor.js` file in the `src/extractors` directory.
Here we need to tell our bot to extract `number` entities from users messages:

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
Because it needs user input to reply, the `age` Dialog is a PromptIntent:

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
        return [new BotTextMessage(`${age}! You’re pretty old.`)];
    }
    
    return [new BotTextMessage(`${age}... I could be your dad!`)];
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
