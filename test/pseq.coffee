assert = require( 'assert' )
pseq = require( '../lib/util/pseq' )
_ = require( 'lodash' )


describe 'pseq', ->
  arr = [ 1, 2, 3, 4, 5 ]
  res = []

  beforeEach -> res = []

  it 'exec promises in sequence', ->
    pseq( _.map( arr, ( x ) -> -> Promise.resolve( res.push x ) ) ).then ->
      assert.deepEqual( res, arr )

  it 'wraps non promises', ->
    pseq( _.map( arr, ( x ) -> -> res.push x ) ).then ->
      assert.deepEqual( res, arr )


