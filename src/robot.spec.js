const test = require('tape');
const {right, left, forward, instruct, process} = require('./robot.js');


test('robot', function (t) {
  t.plan(5);

  t.test('robot.right', t => {
    t.plan(5);

    t.equal(right('N'), 'E');
    t.equal(right('E'), 'S');
    t.equal(right('S'), 'W');
    t.equal(right('W'), 'N');
    t.equal(right('foo'), 'foo');
  });

  t.test('robots.left', t => {
    t.plan(5);

    t.equal(left('N'), 'W');
    t.equal(left('W'), 'S');
    t.equal(left('S'), 'E');
    t.equal(left('E'), 'N');
    t.equal(left('foo'), 'foo');
  });

  t.test('robots.forward', t => {
    t.plan(6);

    const bounds = forward('5 3');

    t.test('scent', t => {
      t.plan(1);
      const position = '0 0 N';
      const scents = [position];
      t.deepEqual(bounds({position, scents}), {position, scents});
    });

    t.test('north', t => {
      t.plan(1);
      const position = '0 0 N';
      const scents = [];
      t.deepEqual(bounds({position, scents}), {position: '0 1 N', scents});
    });

    t.test('east', t => {
      t.plan(1);
      const position = '0 0 E';
      const scents = [];
      t.deepEqual(bounds({position, scents}), {position: '1 0 E', scents});
    });

    t.test('south', t => {
      t.plan(1);
      const position = '0 1 S';
      const scents = [];
      t.deepEqual(bounds({position, scents}), {position: '0 0 S', scents});
    });

    t.test('west', t => {
      t.plan(1);
      const position = '1 0 W';
      const scents = [];
      t.deepEqual(bounds({position, scents}), {position: '0 0 W', scents});
    });

    t.test('lost', t => {
      t.plan(4);
      let position = '';
      const scents = [];

      position = '5 3 N';
      t.deepEqual(bounds({position, scents}), {
        position: `${position} LOST`,
        scents: [position]
      });

      position = '5 3 E';
      t.deepEqual(bounds({position, scents}), {
        position: `${position} LOST`,
        scents: [position]
      });

      position = '0 0 S';
      t.deepEqual(bounds({position, scents}), {
        position: `${position} LOST`,
        scents: [position]
      });

      position = '0 0 W';
      t.deepEqual(bounds({position, scents}), {
        position: `${position} LOST`,
        scents: [position]
      });
    });
  });

  t.test('robot.instruct', t => {
    t.plan(5);
    const bounds = instruct('5 3');
    const position = '0 0 N';
    const scents = [];
    const input = {position, scents};

    t.deepEqual(bounds('foo')(input), input);

    t.test('forward', t => {
      t.plan(1);
      t.deepEqual(bounds('F')(input), {position: '0 1 N', scents});
    });

    t.test('right', t => {
      t.plan(1);
      t.deepEqual(bounds('R')(input), {position: '0 0 E', scents});
    });

    t.test('left', t => {
      t.plan(1);
      t.deepEqual(bounds('L')(input), {position: '0 0 W', scents});
    });

    t.test('lost', t => {
      t.plan(1);
      input.position = `${position} LOST`;
      t.deepEqual(bounds('F')(input), {position: '0 0 N LOST', scents});
    });
  });

  t.test('robot.process', t => {
    t.plan(3);
    const bounds = process('5 3');
    const input = {};

    input.position = '1 1 E';
    input.scents = [];
    t.deepEqual(bounds('RFRFRFRF')(input), input);

    input.position = '3 2 N';
    input.scents = [];
    t.deepEqual(bounds('FRRFLLFFRRFLL')(input), {
      position: '3 3 N LOST',
      scents: ['3 3 N']
    });

    input.position = '0 3 W';
    input.scents = ['3 3 N'];
    t.deepEqual(bounds('LLFFFLFLFL')(input), {
      position: '2 3 S',
      scents: ['3 3 N']
    });
  });
});
