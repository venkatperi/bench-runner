const _ = require( 'lodash' );
const SuiteReporter = require( './_suite_reporter' );

class ConsoleReporter extends SuiteReporter {

  constructor( opts ) {
    super( opts );
    this.opts = _.extend( {}, {indent : 2}, opts );
  }

  before( suite ) {
    if ( suite.hasBenchmarks ) {
      this.print( `[${suite.name}]`, suite.level );
    }
  }

  after( suite ) {
    let filter = this.opts.filter;
    if ( filter && suite.length > 0 ) {
      this.print( filter + ': ' + suite.filter( filter ).map( 'name' ), suite.level );
    }
  }

  afterEach( suite, bench ) {
    if ( bench ) {
      this.print( String( bench ), suite.level + 1 );
    }
  }

  print( str, level = 0 ) {
    console.log( _.repeat( ' ', level * this.opts.indent ) + str );
  }
}

module
    .exports = ConsoleReporter;
