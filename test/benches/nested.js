suite( 'top level suite', () => {
  suite( 'sub suite 1', () => {
    bench( 'RegExp#test', () => /o/.test( 'Hello World!' ) );
    bench( 'String#indexOf', () => 'Hello World!'.indexOf( 'o' ) > -1 );
    bench( 'String#match', () => !!'Hello World!'.match( /o/ ) );
  } );

  suite( 'sub suite 1', () => {
    bench( 'RegExp#test', () => /o/.test( 'Hello World!' ) );
    bench( 'String#indexOf', () => 'Hello World!'.indexOf( 'o' ) > -1 );
    bench( 'String#match', () => !!'Hello World!'.match( /o/ ) );
  } );
} );
