import fs from 'fs';

interface Num {
  lastRound: number;
  secondRound: number;
  value: number;
}

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  let round = 1;
  let last = 0;
  const oldValues: { [key: number]: Num } = {};
  contents.trim().split(",").forEach(
    (x: string) => {
      const n = parseInt(x);
      last = n;
      const v = {
        lastRound: round,
        secondRound: 0,
        value: n,
      };
      oldValues[n] = v;
      console.log(`${round} :  ${n}`);
      round++;
    }
  );
  // console.log(oldValues)

  let n = 0;
  const maxRound = 30000000;
  // const maxRound = 10
  for (; round <= maxRound; round++) {
    if (last in oldValues) {
      if (oldValues[last].secondRound == 0) {
        n = 0;
      }
      else {
        // console.log("r:", last, oldValues[last].lastRound, oldValues[last].secondRound)
        n = oldValues[last].lastRound - oldValues[last].secondRound;
      }
    }
    else {
      n = 0;
    }
    if (n in oldValues) {
      // console.log("u:", n, oldValues[n].secondRound, oldValues[n].lastRound)

      oldValues[n].secondRound = oldValues[n].lastRound;
      oldValues[n].lastRound = round;
    }
    else {
      oldValues[n] = {
        lastRound: round,
        secondRound: 0,
        value: n,
      };
    }
    last = n;
    // console.log(oldValues)
  }
  console.log(`${round} :  ${n}`);
});

const compare = (a: number, b: number): number => a - b;
