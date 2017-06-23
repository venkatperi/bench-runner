const _ = require( 'lodash' );
const SuiteReporter = require( './suite_reporter' );

class ConsoleReporter extends SuiteReporter {

  before( suite ) {
    this.print( `[${suite.name}]`, suite.level );
  }

  afterEach( suite, bench ) {
    this.print( String( bench ), suite.level + 1 );
  }

  print( str, level = 0 ) {
    console.log( _.repeat( ' ', level * 2 ) + str );
  }
}

module.exports = ConsoleReporter;
