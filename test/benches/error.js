suite( 'errors', () => {
  suite( 'in suite config', () => {
    before( () => { throw new Error( 'this error from suite config fn: before' ); } );
    bench( 'in benchmark', () => { throw new Error( 'this error from benchmark fn' ); } );
    throw new Error( 'this error from suite config fn' );
  } );
  bench( 'RegExp#test', () => /o/.test( 'Hello World!' ) );
} );