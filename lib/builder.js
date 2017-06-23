const _ = require( 'lodash' );
const Suite = require( './suite' );

let current = null;
let last = Promise.resolve();

function suite( name, fn ) {
  let s = new Suite( name, {parent : current} );
  if ( current ) {
    current.children.push( s );
  }
  current = s;

  fn();

  if ( current.parent ) {
    current = current.parent;
  }
  else {
    runSuite( current );
  }
}

function runSuite( suite ) {
  last = last.then( () => suite._before() );
  for ( let child of suite.children ) {
    last = last.then( () => runSuite( child ) );
  }
  last = last.then( () => suite.run() );
}

function bench( name, opts, fn ) {
  if ( typeof opts === 'function' ) {
    fn = opts;
    opts = undefined;
  }
  current.add( name, fn, opts );
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

module.exports = suite;

