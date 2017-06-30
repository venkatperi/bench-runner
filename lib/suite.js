const _ = require( "lodash" );
const Benchmark = require( "benchmark" );
const ConsoleReporter = require( "./reporters/console_reporter" );
const pseq = require( './util/pseq' );
const {EventEmitter} = require( 'events' );
const reportErr = require( './util/reportErr' );

function _nop() {}

class Suite extends EventEmitter {
  constructor( name, opts ) {
    super();

    opts = _.extend( {}, opts );

    this.children = [];
    this.name = name;
    this.parent = opts.parent;
    if ( this.parent ) {
      this.parent.children.push( this );
    }
    this.results = {
      path : this.path
    };
    this.suite = new Benchmark.Suite( name );

    if ( opts.test ) {
      this.on( 'beforeEach', ( bench ) => bench && bench.abort() );
    }

    this.on( 'afterEach', this._setResults.bind( this ) );
    if ( this.isRoot ) {
      this.on( 'before', () => this.emit( 'start' ) );
      this.on( 'after', () => process.nextTick( () => this.emit( 'end' ) ) );
    }

    this._initReporter( opts );
  }

  get reporter() {
    return this.parent ? this.parent.reporter : this._reporter;
  }

  set reporter( r ) {
    this._reporter = r;
  }

  get hasBenchmarks() {
    return this.length > 0 || this.children.find( ( x ) => x.hasBenchmarks ) !== undefined
  }

  get length() {
    return this.suite.length;
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

  getBench( name ) {
    return this.suite.filter( ( x ) => x.name === name )[0];
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
    let bench = this.getBench( name );
    bench.path = this.path + ':' + name;
    bench.parent = this;
    return this;
  }

  walk( visitor, context ) {
    visitor = _.extend( {},
        {
          beforeChildren : _nop,
          afterChildren : _nop,
          beforeChild : _nop,
          afterChild : _nop
        }, visitor );
    return this._walk( visitor, context );
  }

  _walk( visitor, context ) {
    return pseq( _.flattenDeep( [
      () => visitor.beforeChildren( this, context ),
      _.map( this.children, ( x ) => [
        () => visitor.beforeChild( this, context ),
        () => x.walk( visitor, context ),
        () => visitor.afterChild( this, context )] ),
      () => visitor.afterChildren( this, context )] ) );
  }

  run( opts ) {
    return this.walk( {
      beforeChildren : ( x ) => x.emit( 'before' ),
      beforeChild : ( x ) => x.emit( 'beforeEach' ),
      afterChild : ( x ) => x.emit( 'afterEach' ),
      afterChildren : ( x ) => x._run( opts ).then( () => x.emit( 'after' ) )
    } )
  }

  _run( opts ) {
    if ( this.length === 0 ) {
      return Promise.resolve();
    }
    opts = _.extend( {}, opts, {async : true} );

    let self = this;
    return new Promise( ( resolve, reject ) =>
        this.suite
            .on( 'complete', resolve )
            .on( 'error', ( x ) => reject( {error : x.target.error, suite : self, bench : x.target} ) )
            .on( 'abort', ( x ) => reject( x.target ? x.target : x ) )
            .run( opts )
    ).catch( ( err ) => reportErr( err ) );
  }

  _setResults( bench ) {
    if ( !bench ) {
      return;
    }
    this.results[bench.name] = _.pick( bench, ['count', 'cycles', 'error', 'hz', 'stats'] );
  }

  _initReporter( opts ) {
    if ( !this.reporter ) {
      this._reporter = opts.reporter || new ConsoleReporter();
    }
    this.reporter.listen( this );
  }

}
module.exports = Suite;
