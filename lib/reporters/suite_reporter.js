const {EventEmitter} = require( "events" );

const events = ['start', 'cycle', 'abort', 'reset', 'complete'];

class SuiteReporter extends EventEmitter {

  constructor( suite ) {
    super();
    this.suite = suite;
    let self = this;
    for ( let event of events ) {
      suite.on( event, ( e ) => self.emit( event, e.target ? e.target : e ) )
    }
    suite.on( 'error', ( bench ) => self.emit( 'error', bench.error, bench ) )
  }
}

module.exports = SuiteReporter;
