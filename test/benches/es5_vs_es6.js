suite( 'es5 vs es6', () => {
  suite( 'arrow functions', () => {
    var es5obj = {
      value : 42,
      fn : function () { return function () { return es5obj.value; }; }
    };
    var es5fn = es5obj.fn();

    var es6obj = {
      value : 42,
      fn : function () { return () => this.value; }
    };
    var es6fn = es6obj.fn();

    bench( 'es5', es5fn );
    bench( 'es6', es6fn );
  } );

  suite( 'classes', () => {
    function ES5() { this.foo = 'bar'; }

    ES5.prototype.bar = function () { };

    class ES6 {
      constructor() { this.foo = 'bar'; }

      bar() { }
    }

    bench( 'es5', () => new ES5() );
    bench( 'es6', () => new ES6() );
  } );

  suite( 'generator', () => {
    function es5generator() {
      var i = 0;
      return {
        next : function () {
          i++;
          if ( i >= 3 ) {
            return {done : true};
          } else {
            return {
              value : i,
              done : false
            };
          }
        }
      };
    }

    function es5fn() {
      var iterator = es5generator();
      iterator.next();
      iterator.next();
      return iterator.next().done;
    }

    function * es6generator() {
      yield 1;
      yield 2;
    }

    function es6fn() {
      var iterator = es6generator();
      iterator.next();
      iterator.next();
      return iterator.next().done;
    }

    bench('es5', es5fn);
    bench('es6', es6fn);
  } );

} );

