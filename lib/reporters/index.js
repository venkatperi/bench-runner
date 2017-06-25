const fs = require( 'fs' );
const path = require( 'path' );
const _ = require( 'lodash' );

function list() {
  return new Promise( ( resolve, reject ) => {
    fs.readdir( __dirname, ( err, list ) => {
      if ( err ) {
        return reject( err )
      }
      resolve( list
          .filter( ( x ) => (x[0] !== '_') && _.endsWith( x, '.js' ) )
          .map( ( x ) => x.split( '_' )[0] ) );
    } );
  } );
}

function load( name ) {
  try {
    return require( `./${name}_reporter` )
  }
  catch ( e ) {
    return require( name )
  }
}

module.exports = {
  list : list,
  load : load
}