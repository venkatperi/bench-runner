suite( 'find in string', () => {
  bench( 'RegExp#test', function () {
    /o/.test( 'Hello World!' );
  } );

  bench( 'String#indexOf', function () {
    'Hello World!'.indexOf( 'o' ) > -1;
  } );

  bench( 'String#match', function () {
    !!'Hello World!'.match( /o/ );
  } )
} );