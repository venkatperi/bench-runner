const _ = require( 'lodash' );

module.exports = seq = ( arr ) =>
    _.reduce( arr, ( r, n ) => r.then( n ), Promise.resolve() );
