assert = require( 'assert' )
_ = require( 'lodash' )
{runner} = require '../'

describe 'runner', ->

  it 'invoke on a list of files', ->
    runner( files : [ "#{__dirname}/benches/string.js" ] )
