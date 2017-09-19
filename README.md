# Bot SDK 2

## Adapters

### Messenger adapter

To set up messenger adapter you need to:
- [Create a page](https://www.facebook.com/pages/create) on facebook.
- [Create an app](https://developers.facebook.com/apps) on facebook developers.
- Get your [page access token](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#get_page_access_token) and note it ( `FB_PAGE_ACCESS_TOKEN` ).
- [Subscribe](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#subscribe_app_page) the app to the page.
- Define a verify token of your choice ( `FB_VERIFY_TOKEN` ).
- [Set up webhook](https://developers.facebook.com/docs/messenger-platform/guides/quick-start/#setup_webhook), you need to run the bot for this step

Then run the bot with `FB_VERIFY_TOKEN` and `FB_PAGE_ACCESS_TOKEN` env vars

#### Run the bot

```
BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> FB_VERIFY_TOKEN=<...> FB_PAGE_ACCESS_TOKEN=<...> npm run bot
```
