const fs = require( 'fs' );
const builder = require( './builder' );
const yargs = require( 'yargs' );

const args = yargs.options( {} );

let dir = process.cwd() + '/benches';
fs.readdir( dir, ( err, files ) => {
  if ( err ) {
    console.log( err );
    return;
  }

  let p = Promise.resolve();
  for ( let file of files ) {
    try {
      require( `${dir}/${file}` );
    }
    catch ( e ) {
      console.log( e );
    }
  }
} );
