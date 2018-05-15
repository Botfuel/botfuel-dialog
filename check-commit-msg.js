const fs = require('fs');

const COMMIT_RULE = /^(build|ci|chore|docs|feat|fix|perf|refactor|style|test)(\\([a-z\\-]+\\))?: .*/;

const commitMessageFilename = process.env.GIT_PARAMS; // HUSKY_GIT_PARAMS for husky@next
const commitMessage = fs.readFileSync(commitMessageFilename, 'utf8');

const compliance = commitMessage.match(COMMIT_RULE);

if (!compliance) {
  console.log('You just tried to commit a change with a commit message that does not comply');
  console.log('with our contributing rules:');
  console.log('------------------------------');
  console.log(commitMessage);
  console.log('------------------------------');
  console.log();
  console.log('Reminder: commits must comply with the following regex:');
  console.log(`"${COMMIT_RULE}"`);
  console.log();
  console.log('Example:');
  console.log('------------------------------');
  console.log('feat: Add the carrier pigeon adapter.');
  console.log();
  console.log('Implement an adapter to the carrier pigeon messaging platform.');
  console.log();
  console.log('BREAKING CHANGE: Add a new abstract method Adapter.dealWithLostMessages()');
  console.log('that must be implemented for each adapter.');
  console.log('------------------------------');
  console.log();
  console.log('Please see CONTRIBUTING.md for more details.');
  process.exit(1);
}
