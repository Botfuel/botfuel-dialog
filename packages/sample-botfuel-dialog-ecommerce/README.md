[![Build Status](https://travis-ci.org/Botfuel/sample-botfuel-dialog-ecommerce.svg?branch=master)](https://travis-ci.org/Botfuel/sample-botfuel-dialog-ecommerce)

# sample-botfuel-dialog-ecommerce

This sample bot illustrates how you can implement a bot on Facebook Messenger with structured message like carousel.

## Run the bot

Before running your bot, there are a few steps to connect it to Facebook Messenger:
- [Create a page](https://www.facebook.com/pages/create) on Facebook.
- Get your [page access token](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#get_page_access_token) and note it ( `FB_PAGE_ACCESS_TOKEN` ).
- [Subscribe](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#subscribe_app_page) your app to the page you just created.
- Define a verify token of your choice ( `FB_VERIFY_TOKEN`, ex: 'MyBotToken2017' ).
- [Set up a webhook](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#setup_webhook) to allow your application to talk with Messenger (you need to have a running bot for this step).

Then run the bot with the following environment variables:

```shell
FB_VERIFY_TOKEN=<...> FB_PAGE_ACCESS_TOKEN=<...> BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> npm start messenger-config
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
