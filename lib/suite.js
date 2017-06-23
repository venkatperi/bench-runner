const _ = require( "lodash" );
const Benchmark = require( "benchmark" );
const ConsoleReporter = require( "./reporters/console_reporter" );

function _nop() {}

class Suite {

  constructor( name, opts ) {
    opts = _.extend( {}, opts );

    this.name = name;
    this.before = _nop;
    this.after = _nop;
    this.beforeEach = _nop;
    this.afterEach = _nop;
    this.count = 0;
    this.parent = opts.parent;
    this.children = [];
    this.reporter = this.parent ? this.parent.reporter : new ConsoleReporter( this );
    this.suite = new Benchmark.Suite( name );
  }

  get level() {
    return this.parent ? this.parent.level + 1 : 0;
  }

  print( str, level = 0 ) {
    this.reporter.print( str, this.level + level )
  }

  add( name, theTest, options ) {
    let defer = theTest.length === 1;

    options = _.extend( {}, options, {
      defer : defer,
      onStart : ( e ) => this._beforeEach( e.target ? e.target : e ),
      onComplete : ( e ) => this._afterEach( e.target ? e.target : e )
    } );

    let fn = defer ? ( d ) => theTest( () => d.resolve() ) : theTest;
    this.suite.add( name, fn, options );
    this.count++;
    return this;
  }

  run( opts ) {
    return new Promise( ( resolve, reject ) => {
      if ( this.count === 0 ) {
        return resolve();
      }

      opts = _.extend( {}, opts, {async : true} );
      this.suite
          .on( 'complete', resolve )
          .on( 'error', reject )
          .on( 'abort', reject )
          .run( opts );
    } )
        .then( () => this._after() );
  }

  _before() {
    this.before();
    this.reporter.before( this );
  }

  _after() {
    this.after();
    this.reporter.after( this );
  }

  _beforeEach( bench ) {
    this.beforeEach();
    this.reporter.beforeEach( this, bench );
  }

  _afterEach( bench ) {
    this.afterEach();
    this.reporter.afterEach( this, bench );
  }
}
module.exports = Suite;
