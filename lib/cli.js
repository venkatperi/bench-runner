const _ = require( 'lodash' );
const yargs = require( 'yargs' );
const path = require( 'path' );
const glob = require( 'glob-promise' );
const runner = require( './runner' );

const args = yargs.options( {
  r : {alias : 'recursive', default : false, boolean : true},
  d : {
    alias : 'delay',
    number : true,
    desc : "The delay between test cycles (secs)"
  },
  x : {
    alias : 'maxTime',
    number : true,
    desc : "The maximum time a benchmark is allowed to run before finishing (secs)"
  },
  s : {
    alias : 'minSamples',
    number : true,
    desc : "The minimum sample size required to perform statistical analysis"
  },
  n : {
    alias : 'minTime',
    number : true,
    desc : "The time needed to reduce the percent uncertainty of measurement to 1% (secs)"
  },
  g : {
    alias : 'grep',
    string : true,
    desc : "Run only tests matching <pattern>"
  }
} ).argv;

//compile grep pattern
args.grep = args.grep ? new RegExp(args.grep) : undefined;

//glob files
let files = args._.length ? args._ : ['benches'];
let pattern = args.recursive ? '**/' : '';
pattern += '*.js';

Promise
    .all( _.map( files, ( f ) => glob( pattern, {cwd : f, absolute : true} ) ) )
    .then( _.flatten )
    .then( ( list ) => runner( _.extend( args, {files : list} ) ) )
    .catch( console.log );