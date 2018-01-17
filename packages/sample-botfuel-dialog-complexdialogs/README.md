[![Build Status](https://travis-ci.org/Botfuel/sample-botfuel-dialog-complexdialogs.svg?branch=master)](https://travis-ci.org/Botfuel/sample-botfuel-dialog-complexdialogs)

# sample-botfuel-dialog-complexdialogs

This sample bot illustrates complex dialogs that include digressions, multi-intents, and random access navigation.

## Run the bot

To run this sample in your terminal:

```shell
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> npm start
```

## Train the model

Each time you update the intent files, you have to re-train the model with the following command:

```shell
npm run train
```

## Run the tests

```shell
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> npm test
```

## Clean the brain

To empty the brain of your bot:

```shell
BOTFUEL_APP_TOKEN=<...> npm run clean
```

## Need help ?

- See [**Getting Started**](https://docs.botfuel.io/dialog/getting-started) to learn how to run a bot in minutes.
- See [**Concepts**](https://docs.botfuel.io/dialog/concepts) for explanations about the internals of the SDK.

## License

See the [**License**](LICENSE.md) file.
