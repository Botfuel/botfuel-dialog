# test-complexentities

This bot tests handling more complex uses of entities in dialogs. This includes fulfillment (when entity is accepted when a condition is met), overriding (when new entities replace old ones), and priority (to control the order in which the user is asked for entities).

## Create an app

Create an app and add intents/QnAs on Botfuel Trainer (https://app.botfuel.io).

You can get examples of intents here : https://github.com/Botfuel/botfuel-dialog/blob/master/packages/test-complexentities/intents.xlsx

See the [Getting Started tutorial](https://docs.botfuel.io/platform/tutorials/getting-started) for how to create a new app.

## Run the bot

To run this bot in your terminal:

```shell
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn start
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
