suite( 'nested: top level', () => {
  suite( 'regexp', () => {
    bench( 'RegExp#test', () => /o/.test( 'Hello World!' ) );
  } );

  suite( 'indexOf', () => {
    bench( 'String#indexOf', () => 'Hello World!'.indexOf( 'o' ) > -1 );
  } );
  bench( 'String#match', () => !!'Hello World!'.match( /o/ ) );
} );
