const _ = require( 'lodash' );
const SuiteReporter = require( './_suite_reporter' );

class NullReporter extends SuiteReporter {
}

module.exports = NullReporter;
