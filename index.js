const robot = require('./src/robot.js');
const bounds = robot.process(process.argv[2] || '5 3');
let input = {scents: []};

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    const[position, instructions] = chunk.split('|');
    input.position = position;
    input = bounds(instructions)(input);
    process.stdout.write(`${input.position}\n`);
  }
});
