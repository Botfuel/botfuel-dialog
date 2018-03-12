# Contributing guidelines

In the following, we will use `yarn` as a package manager.


## Clone the repository

```shell
git clone git@github.com:Botfuel/botfuel-dialog.git
```

## Install

```shell
yarn install
```

### Issue with node-gyp and Python v3.x

Install [Python v2.7](https://www.python.org/downloads/release/python-2714/).

```shell
yarn config set python /path/to/python2.7 -g
yarn install
```


## Run the tests

Botfuel Dialog comes with unit and integration tests.

Tests rely on a local mongo instance:

```
mongod
```


### Run the unit tests only

```shell
yarn run unit-test
```


### Run integration tests

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


### Running all the tests

```shell
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn test
```


## Changelog

We use [conventional commits](https://conventionalcommits.org/), with the [angular conventions]( https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular). More details [here](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).


## Publishing

To publish:

```
yarn publish
```

To review the new version number before publishing:
```
lerna publish --skip-git --skip-npm --conventional-commits --changelog-preset=angular
```

If the new version number is incorrect (for example, a breaking change tag was added by mistake), it is possible to manually set it:
* Add a new section in the changelog
* Update the version number in `packages/botfuel-dialog/package.json`
* Test and compile as `yarn publish` would do
* Use `lerna publish`.
