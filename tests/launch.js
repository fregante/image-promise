var isTravis = require('is-travis');
var npmRunAll = require('npm-run-all');

npmRunAll('intern:' + (isTravis ? 'browserstack' : 'chrome'), {
	stdout: process.stdout,
	stdout: process.stderr
}).catch((result) => {
	process.exit(1);
});
