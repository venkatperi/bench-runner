const _ = require( "lodash" );
const Benchmark = require( "benchmark" );
const ConsoleReporter = require( "./reporters/console_reporter" );

function _nop() {}

class Suite {

  constructor( name, reporter ) {
    this.suite = new Benchmark.Suite( name );
    this.reporter = reporter;
    this.before = _nop;
    this.after = _nop;
    this.beforeEach = _nop;
    this.afterEach = _nop;
  }

  on( event, handler ) {
    this.suite.on( event, handler );
    return this;
  }

  add( name, theTest, options ) {
    let defer = theTest.length === 1;
    options = _.extend( {}, options, {
      defer : defer,
      onStart : this.beforeEach,
      onComplete : this.afterEach
    } );

    let fn = defer ? ( d ) => theTest( () => d.resolve() ) : theTest;
    this.suite.add( name, fn, options );
    return this;
  }

  run( opts ) {
    this.reporter = this.reporter || new ConsoleReporter( this.suite );

    let p = new Promise( ( resolve, reject ) => {
      opts = _.extend( {}, opts, {async : true} );
      this.suite.on( 'complete', resolve );
      this.suite.on( 'error', reject );
      this.suite.on( 'abort', reject );
      this.suite.run( opts );
    } );

    p.then( this.after );

    return p;
  }
}
module.exports = Suite;
