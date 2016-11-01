const test = require('tape');
const robots = require('./robots.js');

test('robots', function (t) {
  t.plan(1);

  t.equal(typeof robots, 'function');
});
