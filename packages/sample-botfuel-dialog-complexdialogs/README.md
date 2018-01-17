# test-complexdialogs

This bot tests complex dialogs that include digressions, multi-intents, and random access navigation.

## Run the bot

To run this sample in your terminal:

```shell
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn start
```

## Train the model

Each time you update the intent files, you have to re-train the model with the following command:

```shell
yarn run train
```

## Run the tests

```shell
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn test
```

## Clean the brain

To empty the brain of your bot:

```shell
BOTFUEL_APP_TOKEN=<...> yarn run clean
```

## Need help ?

* See [**Getting Started**](https://docs.botfuel.io/dialog/getting-started) to learn how to run a bot in minutes.
* See [**Concepts**](https://docs.botfuel.io/dialog/concepts) for explanations about the internals of the SDK.

## License

See the [**License**](LICENSE.md) file.
