# test-qna

This bot tests an implementation of a bot with [Botfuel QnA](https://docs.botfuel.io/qna/overview) and the [Webchat](https://docs.botfuel.io/webchat/overview).

## Run the bot

To be able to use Botfuel Webchat with your bot you need to configure your Botfuel application as follows:

1. Go to the Botfuel [developer portal](https://app.botfuel.io/apps).
2. Find your application in the list and click the _Webchat_ button. If you don't see this button, change your plan to enable the Webchat option.
3. Click on the _Configuration_ tab and configure the bot endpoint and the allowed origins.
4. Go back to your app details and copy your APP_TOKEN, then replace the `<YOUR_BOTFUEL_APP_TOKEN>` value in the webchat.html.

If you want to use your bot locally with the Webchat, you have to expose your local machine to the web.
You can do this with [ngrok](https://ngrok.com/) for example.

Then run the bot in your terminal:

```shell
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn start botfuel-config
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
