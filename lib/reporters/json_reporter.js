const _ = require( 'lodash' );
const SuiteReporter = require( './_suite_reporter' );

function gen( suite ) {
  let res = {};
  suite.children.forEach( ( c ) => res[c.name] = gen( c ) );
  _.forOwn( suite._results, ( v, k ) => res[k] = v );
  return res;
}

class JSONReporter extends SuiteReporter {

  constructor( opts ) {
    super( opts );
    this.opts = _.extend( {}, {indent : 2}, opts );
  }

  before( suite ) {
  }

  after( suite ) {
    if ( !suite.isRoot ) {
      return;
    }
    let res = {};
    res[suite.name] = gen( suite )
    console.log( JSON.stringify( res, null, this.opts.indent ) );
  }

  afterEach( suite, bench ) {
    let res = {};
    ['count', 'cycles', 'error', 'hz'].forEach( ( x ) => res[x] = bench[x] )
    res.stats = _.clone( bench.stats );

    suite._results = suite._results || {};
    suite._results[bench.name] = res
  }

}

module.exports = JSONReporter;
