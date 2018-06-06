# test-qna

This sample bot illustrates how you can implement a QnA bot using the [Webchat](https://docs.botfuel.io/webchat/overview). For a step-by-step guide, see the [creating a QnA bot tutorial](https://docs.botfuel.io/platform/tutorials/creating-a-q-a-bot).

## Create an app

Create an app and add QnAs on Botfuel Trainer (https://app.botfuel.io).

You can get examples of intents here : https://github.com/Botfuel/botfuel-dialog/blob/master/packages/test-qna/intents.xlsx

See the [Getting Started tutorial](https://docs.botfuel.io/platform/tutorials/getting-started) for how to create a new app.

## Run the bot

To be able to use Botfuel Webchat with your bot you need to configure your Botfuel application. Follow the steps in the [Connection to Webchat tutorial](https://docs.botfuel.io/platform/tutorials/connecting-to-webchat).

Then run the sample in your terminal:

```shell
BOTFUEL_APP_TOKEN=<YOUR_BOTFUEL_APP_TOKEN> BOTFUEL_APP_ID=<YOUR_BOTFUEL_APP_ID> BOTFUEL_APP_KEY=<YOUR_BOTFUEL_APP_KEY> yarn start botfuel-config
```

## Run the tests

```shell
BOTFUEL_APP_ID=<YOUR_BOTFUEL_APP_ID> BOTFUEL_APP_KEY=<YOUR_BOTFUEL_APP_KEY> yarn test
```

## Clean the brain

To empty the brain of your bot:

```shell
BOTFUEL_APP_TOKEN=<YOUR_BOTFUEL_APP_TOKEN> yarn run clean
```

## Need help ?

* See [**Getting Started**](https://docs.botfuel.io/platform/tutorials/getting-started) to learn how to run a bot in minutes.
* See [**Concepts**](https://docs.botfuel.io/platform/concepts) for explanations about the internals of the SDK.
* See [**how to create a QnA bot**](https://docs.botfuel.io/platform/tutorials/creating-a-q-a-bot)

## License

See the [**License**](LICENSE.md) file.
