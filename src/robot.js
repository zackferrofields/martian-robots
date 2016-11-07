const {
  always, append, compose, contains, cond, equals, flip, identity, lensProp,
  over, pipe, set, T, view, inc, lensIndex, join, dec, both, reduce, uncurryN,
} = require('ramda');

const lens = {};
lens.position = lensProp('position');
lens.scents = lensProp('scents');
lens.x = compose(lens.position, lensIndex(0));
lens.y = compose(lens.position, lensIndex(2));
lens.direction = compose(lens.position, lensIndex(4));
lens.lost = compose(lens.position, lensIndex(6));

const isLost = compose(equals('L'), view(lens.lost));

// Object → Object
const north = compose(
  over(lens.position, join('')),
  over(lens.y, inc)
);

// Object → Object
const east = compose(
  over(lens.position, join('')),
  over(lens.x, inc)
);

// Object → Object
const south = compose(
  over(lens.position, join('')),
  over(lens.y, dec)
);

// Object → Object
const west = compose(
  over(lens.position, join('')),
  over(lens.x, dec)
);

// String → Object
const lost = position => pipe(
  set(lens.position, `${position} LOST`),
  over(lens.scents, append(position))
);

// String → String
const right = cond([
  [equals('N'), always('E')],
  [equals('E'), always('S')],
  [equals('S'), always('W')],
  [equals('W'), always('N')],
  [T, identity]
]);

// String → String
const left = cond([
  [equals('N'), always('W')],
  [equals('W'), always('S')],
  [equals('S'), always('E')],
  [equals('E'), always('N')],
  [T, identity]
]);

// String → Object → Object
const forward = ([x,,y]) => input => {
  const position = view(lens.position, input);
  return cond([
    [compose(contains(position), view(lens.scents)), always(input)],
    [
      both(
        compose(equals('N'), view(lens.direction)),
        compose(y1 => y > y1, view(lens.y))
      ), north
    ],
    [
      both(
        compose(equals('E'), view(lens.direction)),
        compose(x1 => x > x1, view(lens.x))
      ), east
    ],
    [
      both(
        compose(equals('S'), view(lens.direction)),
        compose(y1 => y1 > 0, view(lens.y))
      ), south
    ],
    [
      both(
        compose(equals('W'), view(lens.direction)),
        compose(x1 => x1 > 0, view(lens.x))
      ), west
    ],
    [T, lost(position)]
  ])(input);
};

// String → String → Object → Object
const instruct = bounds => instruction => cond([
  [isLost, identity],
  [() => equals('F', instruction), forward(bounds)],
  [() => equals('R', instruction), compose(
    over(lens.position, join('')),
    over(lens.direction, right))
  ],
  [() => equals('L', instruction), compose(
    over(lens.position, join('')),
    over(lens.direction, left))
  ],
  [T, identity]
]);

const process = bounds => instructions => input =>
  reduce(flip(uncurryN(2, instruct(bounds))), input, instructions);

module.exports = {
  right,
  left,
  forward,
  instruct,
  process
};
