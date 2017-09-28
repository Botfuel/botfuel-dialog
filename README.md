# Bot SDK 2

## Deploy sample

To deploy sample on heroku you have to link an existing heroku app to your sample by adding a remote to the sample.
You can do that with the following command:

```
heroku git:remote -a HEROKU_APP_NAME
```

Then you can deploy your sample to heroku with the following command

```
npm run deploy-sample SAMPLE_NAME
```
