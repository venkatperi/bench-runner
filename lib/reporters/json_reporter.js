const _ = require( 'lodash' );
const SuiteReporter = require( './_suite_reporter' );

function gen( suite ) {
  if ( suite.hasBenchmarks ) {
    let res = {};
    suite.children.forEach( ( c ) => res[c.name] = gen( c ) );
    _.forOwn( suite.results, ( v, k ) => res[k] = v );
    return res;
  }
}

class JSONReporter extends SuiteReporter {

  constructor( opts ) {
    super( opts );
    this.opts = _.extend( {}, {indent : 2}, opts );
  }

  before( suite ) {
  }

  after( suite ) {
    if ( suite.isRoot && suite.hasBenchmarks ) {
      let res = {};
      res[suite.name] = gen( suite )
      console.log( JSON.stringify( res, null, this.opts.indent ) );
    }
  }

}

module.exports = JSONReporter;
