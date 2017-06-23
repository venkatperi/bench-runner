suite( 'es6 lambda vs function', () => {
  suite( 'sub suite 1', () => {
    bench( 'lambda', () => 'Hello World!'.indexOf( 'o' ) > -1 );
    bench( 'function', function () { let x = 'Hello World!'.indexOf( 'o' ) > -1; } );
  } );
  suite( 'sub suite 2', () => {
    bench( 'lambda', () => 'Hello World!'.indexOf( 'o' ) > -1 );
    bench( 'function', function () { let x = 'Hello World!'.indexOf( 'o' ) > -1; } );
  } );
} );
