var fs = require('fs');
import { combinations, ceil } from 'mathjs';

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
  adapt.unshift(0)
  adapt.push(adapt[adapt.length - 1] + 3)
  let diffs: Array<number> = Array.from({ length: adapt.length - 1 }, () => 0)
  for (let i = 1; i < adapt.length; i++) {
    diffs[i] = adapt[i] - adapt[i - 1]
  }
  let ones = 0
  let combos = 1
  console.log("adapt", adapt)
  console.log("diffs", diffs)
  for (let i = 1; i < diffs.length; i++) {
    if (diffs[i] == 1) {
      ones += 1
    } else {
      if (ones > 1) {
        console.log(`Ones = ${ones}`)
        let ct = 0
        const denominator = ones - 1
        const maxRemoved = ones - ceil(ones / 3)
        console.log(`Min ones = ${denominator}`)
        for (let a = 0; a <= maxRemoved; a++) {
          ct += combinations(denominator, a)
          console.log(`Combination(${denominator}, ${a}) = ${combinations(denominator, a)}`)
        }
        combos = combos * ct
        console.log(`Count = ${ct}`, `Combos = ${combos}`)

      }
      ones = 0
    }
  }
  console.log("total combos", combos)
});

const compare = (a: number, b: number): number => a - b;
