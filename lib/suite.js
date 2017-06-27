const _ = require( "lodash" );
const Benchmark = require( "benchmark" );
const ConsoleReporter = require( "./reporters/console_reporter" );
const pseq = require( './util/pseq' );
const {EventEmitter} = require( 'events' );

function _nop() {}

class Suite extends EventEmitter {

  constructor( name, opts ) {
    super();

    opts = _.extend( {}, opts );

    this.name = name;
    this.before = _nop;
    this.after = _nop;
    this.beforeEach = _nop;
    this.afterEach = _nop;
    this.count = 0;
    this.parent = opts.parent;
    this.children = [];
    this.suite = new Benchmark.Suite( name );

    this.reporter = opts.reporter ? opts.reporter : this.parent ? this.parent.reporter : new ConsoleReporter();
    this.reporter.listen( this );

    if ( opts.test ) {
      this.on( 'beforeEach', ( bench ) => bench.abort() );
    }
  }

  get hasBenchmarks() {
    return this.count > 0 || this.children.find( ( x ) => x.hasBenchmarks )
  }

  get root() {
    return !this.parent ? this : this.parent.root
  }

  get isRoot() {
    return !this.parent
  }

  get level() {
    return this.parent ? this.parent.level + 1 : 0;
  }

  get path() {
    return this.parent ? this.parent.path + ':' + this.name : ':' + this.name;
  }

  filter( f ) {
    return this.suite.filter( f );
  }

  print( str, level = 0 ) {
    this.reporter.print( str, this.level + level )
  }

  add( name, theTest, options ) {
    let defer = theTest.length === 1;

    options = _.extend( {}, options, {
      defer : defer,
      onStart : ( e ) => { this.emit( 'beforeEach', e.target ? e.target : e ); },
      onComplete : ( e ) => { this.emit( 'afterEach', e.target ? e.target : e ) }
    } );

    let fn = defer ? ( d ) => theTest( ( val ) => {
      if ( val ) {
        if ( val instanceof Error ) {
          throw val
        }
        throw new Error( String( val ) )
      }
      d.resolve()
    } ) : theTest;

    this.suite.add( name, fn, options );
    this.count++;
    return this;
  }

  run( opts ) {
    if ( !this.hasBenchmarks ) {
      return Promise.resolve();
    }

    return pseq( _.flatten( [() => this.emit( 'before' ),
      _.map( this.children, ( x ) => () => x.run( opts ) ),
      () => this._run( opts ),
      () => this.emit( 'after' )] ) );
  }

  _run( opts ) {
    if ( this.count === 0 ) {
      return Promise.resolve();
    }
    opts = _.extend( {}, opts, {async : true} );

    return new Promise( ( resolve, reject ) =>
        this.suite
            .on( 'complete', resolve )
            .on( 'error', ( x ) => reject( x.target.error ) )
            .on( 'abort', ( x ) => reject( x.target ? x.target : x ) )
            .run( opts )
    )
  }
}
module.exports = Suite;