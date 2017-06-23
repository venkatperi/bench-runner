const _ = require( 'lodash' );

class SuiteReporter {

  before( suite ) { }

  beforeEach( suite, bench ) { }

  afterEach( suite, bench ) { }

  after( suite ) { }

  print( str, level = 0 ) { }
}

module.exports = SuiteReporter;
