const _ = require( 'lodash' );
const Suite = require( './suite' );
const {EventEmitter} = require( 'events' );

let current = null;
let emitter = new EventEmitter();
global.globalOpts = {};

function suite( name, fn ) {
  let s = new Suite( name, {parent : current} );

  if ( current ) {
    current.children.push( s );
  }
  else {
    emitter.emit( 'start', s );
  }

  current = s;

  fn();

  current = current.parent;

  if ( !current ) {
    runSuite( s )
        .then( () => emitter.emit( 'end', s ) )
        .catch( console.log );
  }
}

function runSuite( suite ) {
  if ( suite.children.length === 0 && suite.count === 0 ) {
    return Promise.resolve();
  }

  let last = Promise.resolve( suite._before() );

  for ( let child of suite.children ) {
    last = last.then( () => runSuite( child ) );
  }
  return last.then( () => suite.run() );
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

function before( fn ) {
  current.before = fn;
}

function after( fn ) {
  current.after = fn;
}

function beforeEach( fn ) {
  current.beforeEach = fn;
}

function afterEach( fn ) {
  current.afterEach = fn;
}

global.suite = suite;
global.bench = bench;
global.before = before;
global.after = after;
global.beforeEach = beforeEach;
global.afterEach = afterEach;

module.exports = emitter;