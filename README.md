## benchr

[benchmark.js](http://www.benchmarkjs.com) runner for Node.js like [mocha](http://mochajs.org/).

### Getting Started

```
$ npm install bench-runner -g
$ mkdir benches
$ $EDITOR benches/string.js #open with your favorite editor
```
In your editor:

```javascript
suite( 'find in string', () => {
  bench( 'RegExp#test', () => /o/.test( 'Hello World!' ) );
  bench( 'String#indexOf', () => 'Hello World!'.indexOf( 'o' ) > -1 );
  bench( 'String#match', () => !!'Hello World!'.match( /o/ ) );
} );
```

Back in the terminal:
```
$ bench-runner -f fastest
[find in string]
  RegExp#test x 11,841,755 ops/sec ±3.00% (89 runs sampled)
  String#indexOf x 30,491,086 ops/sec ±0.45% (92 runs sampled)
  String#match x 8,287,739 ops/sec ±2.57% (88 runs sampled)
fastest: String#indexOf
```
### Usage

Run `bench-runner` from the command line. By default, `bench-runner` looks for `*.js` files under the `benches/` subdirectory.

```
$ bench-runner
```

### Options

```
$ bench-runner --help
Options:
  -f, --filter      Report filtered (e.g. fastest) benchmark after suite runs
                                   [choices: "fastest", "slowest", "successful"]
  -d, --delay       The delay between test cycles (secs)                [number]
  -x, --maxTime     The maximum time a benchmark is allowed to run before
                    finishing (secs)                                    [number]
  -s, --minSamples  The minimum sample size required to perform statistical
                    analysis                                            [number]
  -n, --minTime     The time needed to reduce the percent uncertainty of
                    measurement to 1% (secs)                            [number]
  -g, --grep        Run only tests matching <pattern>                   [string]
  -p, --platform    Print platform information                         [boolean]
  -t, --test        Do a drt run without executing benchmarks         [boolean]
  --help            Show help                                          [boolean]
  -r, --recursive                                     [boolean] [default: false]
```

### Nested Benchmarks 
Suites can be nested:

```javascript
suite( 'es5 vs es6', () => {
    suite( 'classes', () => {
      function ES5() { this.foo = 'bar'; }
      ES5.prototype.bar = function () { };
  
      class ES6 {
        constructor() { this.foo = 'bar'; }
        bar() { }
      }
  
      bench( 'es5', () => new ES5());
      bench( 'es6', () => new ES6());
    } );
} );
```
Output:

```
$bench-runner -g classes -f fastest
[es5 vs es6]
  [classes]
    es5 x 66,828,838 ops/sec ±0.84% (91 runs sampled)
    es6 x 32,047,240 ops/sec ±3.07% (82 runs sampled)
  fastest: es5
```

#### Benchmarking Asynchronous Functions
To defer a benchmark, pass an callback argument to the benchmark function. The callback
must be called to end the benchmark.

```javascript
suite('deferred', () => {
  bench('timeout', (done) => setTimeout(done, 100));
});
```
Output:
```
[deferred]
  timeout x 9.72 ops/sec ±0.41% (49 runs sampled)
```

#### Hooks 

Hooks must be synchronous since they are called by `benchmark.js` which does not 
support async hooks at this time. Also, `setup` and`teardown` are compiled into the test function. 
Including either may place restrictions on the scoping/availability of variables in the test function 
(see `benchmark.js` docs for more information).

```javascript
suite('hooks', function() {

  before(function() {
    // runs before all tests in this suite
  });

  after(function() {
    // runs after all tests in this suite
  });

  beforeEach(function() {
    // runs before each benchmark test function in this suite
  });

  afterEach(function() {
    // runs after each benchmark test function in this suite
  });
  
  bench('name', {setup: function(){
    //setup is compiled into the test function and runs before each cycle of the test 
  }})
 
  bench('name', {teardown: function(){
    //teardown is compiled into the test function and runs after each cycle of the test 
  }}, testFn)

  //benchmarks here...
});
```


