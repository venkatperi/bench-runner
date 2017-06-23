const fs = require( 'fs' );
const builder = require( './builder' );

let dir = __dirname + '/../benches';
fs.readdir( dir, ( err, files ) => {
  if ( err ) {
    console.log( err );
    return;
  }

  for ( let file of files ) {
    try {
      require( `${dir}/${file}` );
      runCurrentSuite()
          .then( () => {
            console.log( 'done' );
          } )
          .catch( ( e ) => console.log( e ) );
    }
    catch ( e ) {
      console.log( e );
    }
  }
} );
