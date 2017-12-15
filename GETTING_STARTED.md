By the end of this tutorial, you will have a simple bot that is able to respond to a greeting and say back your name. You will also learn how to add new functionality that will allow the bot to understand a travel intent.

# Get API credentials

You can use the SDK without any API credentials, but in this tutorial we want to take advantage of the entity extraction service.
To get API credentials you need to create a Botfuel developer account and create an app. The Labs plan is free up to 5000 API calls per month!

## Create a Botfuel developer account

If you haven’t already, visit the [Botfuel Developer Portal](https://app.botfuel.io/) and create an account:

<img src="https://s3.eu-west-1.amazonaws.com/botfuel-docs/screenshots/signup.png" alt="Sign up" width="300"/>

## Create an app

Once you have created an account and are logged in, create an app by clicking on the `New app` button:

<img src="https://s3.eu-west-1.amazonaws.com/botfuel-docs/screenshots/createapp.png" alt="Creating an app" width="800"/>

Now name your app, provide an optional description and select a language.

The app’s language determines what language your bot will understand. Under the hood, our NLP APIs behave differently based on the language you choose. You won’t be able to change it later, so choose carefully!

<img src="https://s3.eu-west-1.amazonaws.com/botfuel-docs/screenshots/createapp2.png" alt="Creating an app 2" width="800"/>

## Get the app credentials

Once your app is created, locate the `Credentials` section and take note of the credentials. We will use the App Id and App Key parameters later in this tutorial.

<img src="https://s3.eu-west-1.amazonaws.com/botfuel-docs/screenshots/credentials.png" alt="Credentials" width="800"/>

# Installation

For our tutorial, we will make a copy of an existing sample bot that is able to respond to a greeting and say back your name.

Open a terminal and clone the sample starter bot:

```shell
git clone git@github.com:Botfuel/sample-botfuel-dialog-starter.git
```

Install dependencies:

```shell
cd sample-botfuel-dialog-starter
npm install
```

Start the bot with the `BOTFUEL_APP_ID` and `BOTFUEL_APP_KEY` environment variables using your app’s credentials:

```shell
BOTFUEL_APP_TOKEN=starter BOTFUEL_APP_ID=<YOUR_BOTFUEL_APP_ID> BOTFUEL_APP_KEY=<YOUR_BOTFUEL_APP_KEY> npm start
```

If you set your app credentials right, you should see:

```shell
2017-12-07T16:12:09.131Z - info: [Config] You didn't specify any config file, using default config.
2017-12-07T16:12:09.131Z - info: [Bot] BOTFUEL_APP_TOKEN starter
2017-12-07T16:12:09.133Z - info: [Bot] BOTFUEL_APP_ID <YOUR_BOTFUEL_APP_ID>
2017-12-07T16:12:09.133Z - info: [Bot] BOTFUEL_APP_KEY <YOUR_BOTFUEL_APP_KEY>
> onboarding
```

Your bot is now running, congratulations!

# Bot components

Right now, your bot can respond in two ways:

- Greetings: if you say `hello`, it will simply reply with `Hello human!`
- Name: if you say `My name is Bob` it will reply with `Nice to meet you Bob!`

A bot has 4 basic building components (for more details, check our [concepts](CONCEPTS.md)):

- Intents: text files that contain examples of sentences that are used in training to trigger a Dialog
- Extractors: extract entities (e.g. forename, number, color, city...) that can then be used by the bot
- Dialogs: specify what user input is needed to respond. They interact with the brain and compute the data (e.g, entities, plain text) that will be passed to the corresponding View
- Views: generate the bot messages.

Let’s illustrate this using the `Name` functionality:

| Component | What it does | File
| --- | --- | --- |
| Intent | Matches user input (`My name is Bob` for example) with the `name` intent | `src/intents/name.intent`
| Extractor | Extracts the forename `Bob` from the user sentence | `src/extractors/forename-extractor.js`
| Dialog | Specifies it needs a `forename` entity named `name` | `src/dialogs/name-dialog.js`
| View | Replies with the recognized name | `src/views/name-view.js`

# Add new functionality

So far, our bot is very basic. But we can easily extend its functionality.
Let’s add the travel functionality that works like this:

- User says something like: `I want to travel` or `I want to travel to Paris` (but it can be any city that the user can think of!)
- Bot replies:
  - `Where do you want to go?` if the destination city is missing
  - `<DESTINATION> is a very nice place.` if the destination city is provided

## Add the travel Intent

First let’s create the `travel` intent.
Create an `travel.intent` file in the `src/intents` directory with:

```
I want to travel.
I want to travel to Paris.
```
as its content.

The more examples you add, the better your bot will be able to understand user input and match it to the intent. As you can see from these examples, some include the name of the city and some do not. This is OK, since the purpose of training the intent is to “teach” the bot that the user wants to travel. We will make sure we capture any destination that the user may mention when we get to the city Extractor below.

Run this command to check the contents of your new intent:

```shell
less src/intents/travel.intent
```

This should display:

```
I want to travel.
I want to travel to Paris.
```

In your terminal, execute the following command:

```shell
npm run train
```

This will update the model to include your new intent.
**Be sure to train each time you add, remove or change an intent.**

## Add the city Extractor

Create a `city-extractor.js` file in the `src/extractors` directory so that the bot can extract city names from user input.

```javascript
const { WsExtractor } = require('botfuel-dialog');

class CityExtractor extends WsExtractor {}

CityExtractor.params = {
  dimensions: ['city'],
};

module.exports = CityExtractor;
```

## Add the travel Dialog

Create a `travel-dialog.js` file in the `src/dialogs` directory.
Because it needs the name of the city to be provided by the user to reply, the travel Dialog is a PromptDialog:

```javascript
const { PromptDialog } = require('botfuel-dialog');

class Travel extends PromptDialog {}

Travel.params = {
  namespace: 'travel',
  entities: {
    destination: {
      dim: 'city',
    },
  },
};

module.exports = Travel;
```

Here we say that the travel Dialog needs an entity named `destination` that is a `city`.

## Add the travel View

Create a `travel-view.js` file in the `src/views` directory.
It serves two main purposes. In cases when the user did not provide a city, this would prompt the user to do so. In addition, the View contains the logic of the response based on the user value provided.

Since the travel Dialog is a `PromptDialog`, the travel View needs to be a `PromptView` so it can access the `destination` entity in the `renderEntities` method:

```javascript
const { PromptView, BotTextMessage } = require('botfuel-dialog');

class TravelView extends PromptView {
  renderEntities(matchedEntities) {
    const destination = matchedEntities.destination && matchedEntities.destination.values[0].value;

    if (!destination) {
        return [new BotTextMessage('Where do you want to go?')];
    }

    return [new BotTextMessage(`${destination} is a very nice place.`)];
  }
}

module.exports = TravelView;
```

Here we return different messages based on the value of the `destination` extracted. If no value was successfully extracted, we reply with `Where do you want to go?`.

## Try it out

Run your bot with:

```shell
BOTFUEL_APP_TOKEN=starter BOTFUEL_APP_ID=<YOUR_BOTFUEL_APP_ID> BOTFUEL_APP_KEY=<YOUR_BOTFUEL_APP_KEY> npm start
```

Try and see what your bot thinks about your travel destination!

If you have any issue or question about this tutorial, feel free to open an issue [here](https://github.com/Botfuel/sample-botfuel-dialog-starter/issues).
