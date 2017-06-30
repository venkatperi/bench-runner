module.exports = ( err, suite, bench ) => {
  if ( err.suite ) {
    bench = err.bench;
    suite = err.suite;
    err = err.error;
  }

  let name = [];
  if ( suite ) {
    name.push( suite.path );
  }
  if ( bench ) {
    name.push( bench.name );
  }
  name = name.join( ':' );

  if ( !name.length || !globalOpts || !globalOpts.grep || globalOpts.grep.test( name ) ) {
    if ( name.length ) {
      console.log( 'Error in ' + name );
    }
    console.log( err );
  }
}