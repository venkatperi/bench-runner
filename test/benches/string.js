suite( 'find in string', () => {
  bench( 'RegExp#test', () => /o/.test( 'Hello World!' ) );
  bench( 'String#indexOf', () => 'Hello World!'.indexOf( 'o' ) > -1 );
  bench( 'String#match', () => !!'Hello World!'.match( /o/ ) );
} );