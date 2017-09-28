# testbot

## How to train the model
```
npm run train -- shell_config
```

## How to clean the brain (TODO: implement)
```
npm run clean
```

## How to run the tests
```
BOTFUEL_PROXY_HOST=https://api.botfuel.io/staging BOTFUEL_APP_ID=29ce6795 BOTFUEL_APP_KEY=703d9ff1e2cfdf6a2ccc591213e57053 npm run test
```

## How to run the bot

### Shell
```
BOTFUEL_PROXY_HOST=https://api.botfuel.io/staging BOTFUEL_APP_ID=29ce6795 BOTFUEL_APP_KEY=703d9ff1e2cfdf6a2ccc591213e57053 npm run bot -- shell_config
```

### Messenger

To set up messenger adapter you need to:
- [Create a page](https://www.facebook.com/pages/create) on facebook.
- [Create an app](https://developers.facebook.com/apps) on facebook developers.
- Get your [page access token](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#get_page_access_token) and note it ( `FB_PAGE_ACCESS_TOKEN` ).
- [Subscribe](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#subscribe_app_page) the app to the page.
- Define a verify token of your choice ( `FB_VERIFY_TOKEN` ).
- [Set up webhook](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#setup_webhook), you need to run the bot for this step

Then run the bot with `FB_VERIFY_TOKEN` and `FB_PAGE_ACCESS_TOKEN` env vars

```
FB_VERIFY_TOKEN=BotSDK2Sample FB_PAGE_ACCESS_TOKEN=EAAEBdpxs1WkBALtbvWqCwupvQZCAfRvxZBDtZBvCW96gkMAS110MfoGHCDxV4sRKSN8hl34pkSAG97vMMI0NZBAW8VZAZC5LJAZB5wB7SCBhBm7dGynZC0Jl4DvykWrXqKc7W4KRKv4iTZBvoV7IyeAtpdZCZAGiZAhKcQZB2qHdKBUL6lQZDZD BOTFUEL_PROXY_HOST=https://api.botfuel.io/staging BOTFUEL_APP_ID=29ce6795 BOTFUEL_APP_KEY=703d9ff1e2cfdf6a2ccc591213e57053 npm run bot -- messenger_config
```

### Botfuel webchat
```
CHAT_SERVER=https://botfuel-webchat-server-staging.herokuapp.com BOTFUEL_PROXY_HOST=https://api.botfuel.io/staging BOTFUEL_APP_ID=29ce6795 BOTFUEL_APP_KEY=703d9ff1e2cfdf6a2ccc591213e57053 npm run bot -- botfuel_config
```