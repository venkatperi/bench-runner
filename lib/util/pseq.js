module.exports = ( arr ) => arr.reduce(
    ( r, n ) => r.then( typeof n === 'function' ? n : () => Promise.resolve( n ) ),
    Promise.resolve() );
