# test-complexentities

This bot tests handling more complex uses of entities in dialogs. This includes fulfillment (when entity is accepted when a condition is met), overriding (when new entities replace old ones), and priority (to control the order in which the user is asked for entities).

## Run the bot

To run this bot in your terminal:

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

* See [**Getting Started**](https://docs.botfuel.io/platform/tutorials/getting-started) to learn how to run a bot in minutes.
* See [**Concepts**](https://docs.botfuel.io/platform/concepts) for explanations about the internals of the SDK.

## License

See the [**License**](LICENSE.md) file.
