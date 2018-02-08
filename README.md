# Botfuel Dialog
[![Build Status](https://travis-ci.org/Botfuel/botfuel-dialog.svg?branch=master)](https://travis-ci.org/Botfuel/botfuel-dialog)

Build highly conversational bots with Botfuel Dialog.

## Start writing a bot using Botfuel Dialog
Read [**Getting Started**](https://docs.botfuel.io/dialog/getting-started) to learn how to run a bot in minutes.

For more explanations about the internals of Botfuel Dialog, see [**Concepts**](https://docs.botfuel.io/dialog/concepts).

## Check the samples
Botfuel Dialog comes with [samples](https://github.com/Botfuel/botfuel-dialog/tree/master/packages) which also serve as integration tests (see below how to run them).

We also provide some standalone [sample bots](https://github.com/topics/botfuel-dialog-samples) written with Botfuel Dialog. These are used in blog posts and docs.

## Enter a ticket
If you have any issue or question, feel free to [open a ticket](https://github.com/Botfuel/botfuel-dialog/issues).

## Contribute to Botfuel Dialog
In addition to your feedback, we also welcome your contributions.
In the following, we will use `yarn` as a package manager.

### Clone the repository
```shell
git clone git@github.com:Botfuel/botfuel-dialog.git
```

### Install
```shell
yarn install
```

#### Issue with node-gyp and Python v3.x
Install [Python v2.7](https://www.python.org/downloads/release/python-2714/).
```shell
yarn config set python /path/to/python2.7 -g
yarn install
```

### Run the tests
Botfuel Dialog comes with unit and integration tests.

#### Run the unit tests only
```shell
npm run unit-test
```

#### Run integration tests
```shell
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn test packages/<PACKAGE_NAME>
```

Example:
```shell
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn test packages/test-qna
```

By default, integration tests are run using fixtures.
To register new fixtures, add `REPLAY=record` to the test command:
```shell
REPLAY=record BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn test
```
This will make real API calls and create new fixtures.

#### Running all the tests
```shell
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn test
```

## License
See the [**License**](LICENSE.md) file.
