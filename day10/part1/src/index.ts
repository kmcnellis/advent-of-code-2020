var fs = require('fs');

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const values: Array<number> = contents.trim().split("\n").map(
    (x: string): number => {
      return parseInt(x)
    }
  );

  let adapt = values.sort(compare)
  adapt.push(adapt[adapt.length - 1] + 3)
  adapt.unshift(0)
  let vals: { [key: number]: number } = { 1: 0, 2: 0, 3: 0 }
  for (let i = 1; i < adapt.length; i++) {
    let diff = adapt[i] - adapt[i - 1]
    vals[diff]++
  }
  console.log(adapt)
  console.log(vals)

});

const compare = (a: number, b: number): number => a - b;
