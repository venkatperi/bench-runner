Suite = require '../lib/suite'
assert = require 'assert'
StringReporter = require '../lib/reporters/string_reporter'

b1 = -> 'Hello World!'.indexOf( 'o' ) > -1

describe 'suite', ->
  root = null

  beforeEach ->
    root = new Suite( 'root', { reporter : new StringReporter( { sep : ',' } ) } )

  it 'name, path, isRoot, root', ->
    assert.equal( root.name, 'root' )
    assert.equal( root.path, ':root' )
    assert.equal( root.isRoot, true )
    assert.equal( root.root, root )
    assert.equal( root.length, 0 )
    assert.equal( root.hasBenchmarks, false )

  describe 'nested', ->
    s1 = null
    beforeEach ->
      s1 = new Suite( 's1', { parent : root } )

    it 'has parent, root, full path', ->
      assert.equal( s1.parent, root )
      assert.equal( s1.isRoot, false )
      assert.equal( root.children.length, 1 )
      assert.equal( root.children[ 0 ], s1 )
      assert.equal( s1.path, ':root:s1' )

    describe 'additional nesting', ->
      s2 = null
      beforeEach ->
        s2 = new Suite( 's2', { parent : s1 } )

      it 'has parent, root, full path', ->
        assert.equal( s2.root, root )
        assert.equal( s2.parent, s1 )
        assert.equal( s2.isRoot, false )
        assert.equal( s1.children.length, 1 )
        assert.equal( s1.children[ 0 ], s2 )
        assert.equal( s2.path, ':root:s1:s2' )

  describe 'reporter', ->
    it 'has a default reporter', ->
      assert root.reporter

    describe 'nested suites', ->
      it 'share root reporter', ->
        s1 = new Suite( 's1', { parent : root } )
        assert.equal root.reporter, s1.reporter

  describe 'benchmark', ->
    res = null

    beforeEach ->
      res = []
      [ 'before', 'beforeEach', 'afterEach', 'after' ].forEach ( e ) ->
        root.on e, ( s ) -> res.push "#{e}#{if s then ':' + s.name else ''}"

    it 'length > 0 & hasBenchmarks', ->
      root.add 'b1', b1
      assert root.length > 0
      assert root.hasBenchmarks

    it 'invokes hooks, without benchmark', ->
      root.run( ).then ->
        assert.deepEqual res, [ 'before', 'after' ]

    it 'invokes hooks, with benchmark', ->
      root.add 'b1', b1
      root.run( ).then ->
        assert.deepEqual res, [ 'before', 'beforeEach:b1', 'afterEach:b1', 'after' ]

    describe 'reporter hooks', ->

      it 'no benchmarks', ->
        root.run( ).then ->
          assert.equal root.reporter.toString( ), ":root:before,:root:after"

      it 'with benchmark', ->
        root.add 'b1', b1
        root.add 'b2', b1
        root.run( ).then ->
          assert.equal root.reporter.toString( ), ":root:before,:root:b1:beforeEach,:root:b1:afterEach,:root:b2:beforeEach,:root:b2:afterEach,:root:after"


