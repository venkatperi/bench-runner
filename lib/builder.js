const Suite = require( './suite' );

let suites = [];
let current = null;

function suite( name, fn ) {
  current = new Suite( name );
  suites.push( current );
  fn();
}

function runCurrentSuite() {
  return current.run();
}

function bench( name, opts, fn ) {
  if ( typeof opts === 'function' ) {
    fn = opts;
    opts = undefined;
  }
  current.add( name, fn, opts );
}

function before( fn ) {
  current.onStart = fn;
}

function after( fn ) {
  current.onComplete = fn;
}

function beforeEach( fn ) {
  current.beforeEach = fn;
}

function afterEach( fn ) {
  current.afterEach = fn;
}

global.suite = suite;
global.runCurrentSuite = runCurrentSuite;
global.bench = bench;
global.before = before;
global.after = after;
global.beforeEach = beforeEach;
global.afterEach = afterEach;

module.exports = suite;

