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
* Add a new section in the Changelog
* Update the version number in `packages/botfuel-dialog/package.json`
* Test and compile as `yarn publish` would do
* Use `lerna publish`.
