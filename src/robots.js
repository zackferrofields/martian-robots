const { compose, split, reduce, indexOf } = require('ramda');
const compass = ['N', 'E', 'S', 'W'];
const [ NORTH, EAST, SOUTH, WEST ] = compass;
const LEFT = 'L', RIGHT = 'R', FORWARD = 'F';

const right = orientation => {
  const i = indexOf(orientation, compass);
  return compass[i === compass.length -1 ? 0 : i + 1];
};

const left = orientation => {
  const i = indexOf(orientation, compass);
  return compass[i === 0 ? compass.length -1 : i - 1];
};

const forward = (orientation, [x, y]) => {
  switch (orientation) {
  case NORTH:
    return [x, y + 1];
  case EAST:
    return [x + 1, y];
  case SOUTH:
    return [x, y - 1];
  case WEST:
    return [x - 1, y];
  default:
    return [x, y];
  }
};

const extract = compose(
  ([x, y, orientation]) => [parseInt(x, 10), parseInt(y, 10), orientation],
  split(' ')
);

const process = (location, instruction) => {
  let [x, y, orientation] = extract(location);
  switch (instruction) {
  case LEFT:
    orientation = left(orientation, [x, y]);
    break;
  case RIGHT:
    orientation = right(orientation, [x, y]);
    break;
  case FORWARD:
    [x, y] = forward(orientation, [x, y]);
    break;
  }
  return `${x} ${y} ${orientation}`;
};

const lost = ([x, y]) => location => {
  const [x1, y1] = extract(location);
  if (x1 <= 0 || x1 >= x) return `${location} LOST`;
  if (y1 <= 0 || y1 >= y) return `${location} LOST`;
  return location;
};

const input = bounds => location => compose(
  lost(extract(bounds)),
  reduce(process, location),
  split('')
);

module.exports = {
  input,
  process,
  right,
  left,
  forward,
  extract,
  lost
};
