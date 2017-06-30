const _ = require( 'lodash' );
const SuiteReporter = require( './_suite_reporter' );

class StringReporter extends SuiteReporter {

  constructor( opts ) {
    super( opts );
    this.res = [];
  }

  before( suite ) { this.res.push( suite.path + ':before' ); }

  after( suite ) { this.res.push( suite.path + ':after' ); }

  beforeEach( suite, bench ) { this.res.push( bench.path + ':beforeEach' ); }

  afterEach( suite, bench ) { this.res.push( bench.path + ':afterEach' ); }

  toString() { return this.res.join( this.opts.sep || '\n' ); }

}

module.exports = StringReporter;
