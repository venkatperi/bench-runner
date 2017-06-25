const platform = require( 'platform' );
const builder = require( './builder' );
const reporters = require( './reporters' );

module.exports = ( opts ) => {
  return new Promise( ( resolve, reject ) => {
    globalOpts = opts;
    ReporterKlass = reporters.load( opts.reporter || 'console' )
    reporter = new ReporterKlass( opts )

    if ( opts.platform ) {
      reporter.print( platform );
    }

    let files = opts.files;

    function next() {
      let f = files.shift();
      if ( f ) {
        return require( f );
      }
      resolve();
    }

    builder.on( 'end', () => process.nextTick( () => next() ) );

    next();
  } );
};