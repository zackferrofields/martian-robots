const test = require('tape');
const robots = require('./robots.js');

test('robots', function (t) {
  t.plan(3);

  const bounds = robots('5 3');
  t.equal(bounds('1 1 E')('RFRFRFRF'), '1 1 E');
  t.equal(bounds('3 2 N')('FRRFLLFFRRFLL'), '3 3 N LOST');
  t.equal(bounds('0 3 W')('LLFFFLFLFL'), '2 3 S');
});
