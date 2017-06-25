suite('deferred', () => {
  bench('timeout', (done) => setTimeout(done, 100));
});