const test = require('tape');
const { input, right, left, forward, extract, process, lost } = require('./robots.js');

test('robots', function (t) {
  t.plan(7);

  t.test('robots.right', t => {
    t.plan(4);

    t.equal(right('N'), 'E', 'N -> E');
    t.equal(right('E'), 'S', 'E -> S');
    t.equal(right('S'), 'W', 'S -> W');
    t.equal(right('W'), 'N', 'W -> N');
  });

  t.test('robots.left', t => {
    t.plan(4);

    t.equal(left('N'), 'W', 'N -> W');
    t.equal(left('W'), 'S', 'W -> S');
    t.equal(left('S'), 'E', 'S -> E');
    t.equal(left('E'), 'N', 'E -> N');
  });

  t.test('robots.forward', t => {
    t.plan(4);

    t.deepEqual(forward('N', [1, 1]), [1, 2], 'N, [1, 1] -> [1, 2]');
    t.deepEqual(forward('E', [1, 1]), [2, 1], 'E, [1, 1] -> [2, 1]');
    t.deepEqual(forward('S', [1, 1]), [1, 0], 'S, [1, 1] -> [1, 0]');
    t.deepEqual(forward('W', [1, 1]), [0, 1], 'W, [1, 1] -> [0, 1]');
  });

  t.test('robots.extract', t => {
    t.plan(1);

    t.deepEqual(extract('1 1 N'), [1, 1, 'N'], '1 1 N -> [1, 1, N]');
  });

  t.test('robots.process', t => {
    t.plan(3);

    t.equal(process('1 1 N', 'F'), '1 2 N', '1 1 N -> F -> 1 2 N');
    t.equal(process('1 1 N', 'R'), '1 1 E', '1 1 N -> R -> 1 1 E');
    t.equal(process('1 1 N', 'L'), '1 1 W', '1 1 N -> L -> 1 1 W');
  });

  t.test('robots.lost', t => {
    t.plan(5);

    const bounds = lost([5, 3]);
    t.equal(bounds('-1 1 N'), '-1 1 N LOST', '5 3 -> -1 1 N -> -1 1 N LOST');
    t.equal(bounds('1 -1 N'), '1 -1 N LOST', '5 3 -> 1 -1 N -> 1 -1 N LOST');
    t.equal(bounds('5 1 N'), '5 1 N LOST', '5 3 -> 5 1 N -> 5 1 N LOST');
    t.equal(bounds('1 3 N'), '1 3 N LOST', '5 3 -> 1 3 N -> 1 3 N LOST');
    t.equal(bounds('1 1 N'), '1 1 N', '5 3 -> 1 1 N -> 1 1 N LOST');
  });

  t.test('robots.input', t => {
    t.plan(3);

    const bounds = input('5 3');
    t.equal(bounds('1 1 E')('RFRFRFRF'), '1 1 E');
    t.equal(bounds('3 2 N')('FRRFLLFFRRFLL'), '3 3 N LOST');
    t.equal(bounds('0 3 W')('LLFFFLFLFL'), '2 3 S');
  });
});
