# Botfuel Dialog

[![CircleCI](https://circleci.com/gh/Botfuel/botfuel-dialog.svg?style=svg)](https://circleci.com/gh/Botfuel/botfuel-dialog)

Build highly conversational bots with Botfuel Dialog.

Read [**Getting Started**](https://docs.botfuel.io/platform/tutorials/getting-started) to learn how to run a bot in minutes.
See some [sample bots](https://github.com/topics/botfuel-dialog-samples) written with Botfuel Dialog.

For more explanations about the internals of Botfuel Dialog, see [**Concepts**](https://docs.botfuel.io/platform/concepts).

If you have any issue or question, feel free to [open a ticket](https://github.com/Botfuel/botfuel-dialog/issues).

## Run the tests

### Running all the tests

Run botfuel-dialog and each test packages (integration) tests:

```shell
BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn test
```

### Unit tests

Run only the botfuel-dialog tests:

```shell
yarn unit-test
```

### Integration tests

```shell
BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn test packages/<PACKAGE_NAME>
```

Example:

```shell
BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn test packages/test-qna
```

By default, integration tests are run using fixtures.
To register new fixtures, add `REPLAY=record` to the test command:

```shell
REPLAY=record BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn test
```

This will make real API calls and create new fixtures.

### Publish on NPM

```shell
BOTFUEL_APP_ID=<...> BOTFUEL_APP_KEY=<...> yarn release
```

Publishing requires credentials because it runs integration tests beforehand.

## License

See the [**License**](LICENSE.md) file.
