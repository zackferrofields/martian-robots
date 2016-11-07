const robot = require('./src/robot.js');
const bounds = robot.process('5 3');
let input = {scents: []};

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    const[position, instructions] = chunk.split('|');
    input.position = position;
    input = bounds(instructions)(input);
    process.stdout.write(`${input.position}\n`);
  }
});
