const fs = require('fs');

const COMMIT_RULE = /^(build|ci|chore|docs|feat|fix|perf|refactor|style|test)(\\([a-z\\-]+\\))?: .*/;

const commitMessageFilename = process.env.GIT_PARAMS; // HUSKY_GIT_PARAMS for husky@next
const commitMessage = fs.readFileSync(commitMessageFilename, 'utf8');

const compliance = commitMessage.match(COMMIT_RULE);

if (!compliance) {
  console.log('The commit message does not comply with the contributing rules!');
  console.log('Reminder: commits must comply to the following regex:');
  console.log(`"${COMMIT_RULE}"`);
  console.log();
  console.log(commitMessage);
  process.exit(1);
}
