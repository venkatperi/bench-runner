const _ = require( 'lodash' );
const Suite = require( './suite' );
const {EventEmitter} = require( 'events' );

let current = null;
let emitter = new EventEmitter();

function suite( name, fn ) {
  let s = new Suite( name, {parent : current, reporter : reporter, test: globalOpts.test} );

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
    s.run()
        .then( () => emitter.emit( 'end', s ) )
        .catch( console.log );
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

function before( fn ) {
  // current.before = fn;
  current.on('before', fn)
}

function after( fn ) {
  // current.after = fn;
  current.on('after', fn)
}

function beforeEach( fn ) {
  current.on('beforeEach', fn);
  //current.beforeEach = fn;
}

function afterEach( fn ) {
  // current.afterEach = fn;
  current.on('afterEach', fn);
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