# test-ecommerce

This bot tests how you can implement a bot on Facebook Messenger with structured message like carousel.

## Create an app

Create an app and add intents/QnAs on Botfuel Trainer (https://app.botfuel.io).

You can get examples of intents here : https://github.com/Botfuel/botfuel-dialog/blob/master/packages/test-ecommerce/intents.xlsx

See the [Getting Started tutorial](https://docs.botfuel.io/platform/tutorials/getting-started) for how to create a new app.

## Run the bot

Before running your bot, there are a few steps to connect it to Facebook Messenger:

* [Create a page](https://www.facebook.com/pages/create) on Facebook.
* Get your [page access token](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#get_page_access_token) and note it ( `FB_PAGE_ACCESS_TOKEN` ).
* [Subscribe](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#subscribe_app_page) your app to the page you just created.
* Define a verify token of your choice ( `FB_VERIFY_TOKEN`, ex: 'MyBotToken2017' ).
* [Set up a webhook](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#setup_webhook) to allow your application to talk with Messenger (you need to have a running bot for this step).

Then run the bot with the following environment variables:

```shell
FB_VERIFY_TOKEN=<...> FB_PAGE_ACCESS_TOKEN=<...> BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn start messenger-config
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
