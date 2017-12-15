# Botfuel Dialog

[![Build Status](https://travis-ci.com/Botfuel/botfuel-dialog.svg?token=DzdpA2xzqKcvBPt7ExGD&branch=master)](https://travis-ci.com/Botfuel/botfuel-dialog)
[![Coverage](https://img.shields.io/codecov/c/github/botfuel/botfuel-dialog.svg)](https://codecov.io/gh/Botfuel/botfuel-dialog)

## Test samples

```
BOTFUEL_APP_ID=caa4023f BOTFUEL_APP_KEY=ed02761d20c42480255cb4e2f4b532b4 npm run test-samples
```

## Generate the documentation

The code of the sdk is documented with JSDoc, to generate the doc use the following command :

```
npm run docs
```

## Add/Update headers of js files in the SDK

The script update all js files within a scope, by default the scope is the `src` directory
To header file is `header.txt` under the root directory

To update headers, run:

```
sh scripts/add-header.sh
```

You can pass the scope argument to update one directory, or one js file, for example:

```
sh scripts/add-header.sh src/bot.js
```

## Need help ?

- See [GETTING_STARTED](GETTING_STARTED.md) to learn how to run a bot in minutes.
- See [CONCEPTS](CONCEPTS.md) for explanations about the internals of the SDK.

## License

See the [LICENSE](LICENSE.md) file.
