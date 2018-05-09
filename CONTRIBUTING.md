# Contributing guidelines

In the following, we will use `yarn` as a package manager.


## Clone the repository

```shell
git clone git@github.com:Botfuel/botfuel-dialog.git
```

## Install

```shell
yarn install
yarn bootstrap
```

### Issue with node-gyp and Python v3.x

Make sure that yarn uses python2.7.

First, make sure that you have python2.7 installed. If not, install [Python v2.7](https://www.python.org/downloads/release/python-2714/).

If python2.7 is not the default python version, you can use a virtualenv (`pew`) or:

```shell
yarn config set python /path/to/your/python2.7 -g
yarn install
yarn bootstrap
```


## Workflow

We use the [GitHub workflow](https://guides.github.com/introduction/flow/).

The author of a Pull Request is free to choose the validation criteria that best suits the situation:
* *trivial PR*: there is no reasonable chance any member of the team will suggest modifications, and the PR contains no information that is worth sharing with the other team members. For example, fixing a broken link. The PR can be merged without approval.
* *simple PR*: the PR contains one small non-breaking change which affects only one part of repository. The PR is required to receive one formal approval from a team member.
* *complex PR*: the PR contains a breaking change or affects several parts. These PR should be avoided when possible. The PR is required to receive formal approval from at least two team members. All the team members should be notified of the changes.

When a breaking change is merged to master, then sample bots and documentation should be updated as soon as possible (these updates are implicitely part of the Definition of Done of the task).

After merging a change to master, a new version should be published, except if no code is involved.


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

We use [conventional commits](https://conventionalcommits.org/), with the [angular conventions](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular). More details [here](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).


## Publishing

See our internal documentation to configure login with yarn.

```
BOTFUEL_APP_TOKEN=<...> BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn release
```

To review the new version number before publishing:
```
lerna publish --skip-git --skip-npm --conventional-commits --changelog-preset=angular
```

If the new version number is incorrect (for example, a breaking change tag was added by mistake), it is possible to manually set it:
* Remove the git tag that was potentially created during the failed attempt to publish
* Add a new section in the changelog
* Update the version number in `packages/botfuel-dialog/package.json`
* Test and compile as `yarn publish` would do
* Use `lerna publish`.


## Type checking

We use Facebook Flow as our type-checking solution. We prefer Flow over TypeScript because Flow works with lightweight changes to the code. Integration with Babel is also better for Flow.

To avoid duplications, JSdoc comments should not contain type annotations.


### Caveats

* Flow has still a lot of open issues with exact types. They should be used only when necessary.
* The spread operator is not handled very well.


### Integration with VSCode

First, disable the buildtin JavaScript validation. In the workspace settings: `"javascript.validate.enable": false`. Indeed, Flow annotations are not valid JavaScript.

This combination of plugins work together:
* dbaeumer.vscode-eslint: ESLint integration in VSCode. Not specific to Flow.
* joshpeng.sublime-babel-vscode: Syntax highlighter that handles Flow annotations. The default syntax highlighter breaks on some cases (Flow annotation inside a string template for example).
* flowtype.flow-for-vscode: Flow integration to VSCode.
