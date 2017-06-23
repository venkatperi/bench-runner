const SuiteReporter = require( './suite_reporter' );

class ConsoleReporter extends SuiteReporter {
  constructor( suite ) {
    super( suite );
    this
        .on( 'start', () => console.log( this.suite.name ) )
        .on( 'cycle', ( bench ) => console.log( '> ' + String( bench ) ) )
        .on( 'error', ( err, bench ) => console.err( err ) )
  }
}

module.exports = ConsoleReporter;
