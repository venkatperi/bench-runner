const builder = require( './builder' );
const _ = require( 'lodash' );

module.exports = ( opts ) => {
  globalOpts = opts;
  let files = opts.files;

  function next() {
    let f = files.shift();
    if ( f ) {
      require( f );
    }
  }

  builder.on( 'end', () => process.nextTick( () => next() ) );

  next();
};