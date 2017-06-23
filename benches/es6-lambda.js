suite( 'es6 lambda vs function', () => {
  bench( 'lambda', () => 'Hello World!'.indexOf( 'o' ) > -1 );

  bench( 'function', function () {
    'Hello World!'.indexOf( 'o' ) > -1;
  } );
} );