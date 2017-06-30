const _ = require( 'lodash' );
const Suite = require( './suite' );
const {EventEmitter} = require( 'events' );
const reportErr = require( './util/reportErr' );

let current = null;
let emitter = new EventEmitter();

function suite( name, fn ) {
  let suite = new Suite( name, {
    parent : current,
    reporter : reporter,
    test : globalOpts.test
  } );

  suite.on( 'error', reportErr )
      .on( 'start', () => emitter.emit( 'start', suite ) )
      .on( 'end', () => emitter.emit( 'end', suite ) );

  current = suite;
  try {
    fn(); //configure this suite
  }
  catch ( err ) {
    reportErr( err, suite );
  }
  current = current.parent;

  if ( suite.isRoot ) {
    suite.run().catch( reportErr );
  }
}

function bench( name, opts, fn ) {
  if ( typeof opts === 'function' ) {
    fn = opts;
    opts = undefined;
  }
  let benchOpts = _.pick( globalOpts, ['maxTime', 'minTime', 'minSamples'] );

  if ( !globalOpts.grep || globalOpts.grep.test( `${current.path}:${name}` ) ) {
    current.add( name, fn, _.extend( {}, benchOpts, opts ) );
  }
}

function wrap( fn, suite, bench ) {
  return () => {
    try {
      fn( suite )
    }
    catch ( err ) {
      suite.emit( 'error', err, suite, bench )
    }
  }
}

function before( fn ) {
  current.on( 'before', wrap( fn, current ) )
}

function after( fn ) {
  current.on( 'after', wrap( fn, current ) )
}

function beforeEach( fn ) {
  current.on( 'beforeEach', wrap( fn, current ) )
}

function afterEach( fn ) {
  current.on( 'afterEach', wrap( fn, current ) )
}

global.suite = suite;
global.bench = bench;
global.before = before;
global.after = after;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.globalOpts = {};
global.reporter = null;

module.exports = emitter;