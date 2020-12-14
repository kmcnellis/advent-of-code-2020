var fs = require('fs');

const search = 70639851
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

  let sums: Array<number> = []
  let val = 0
  for (let i = 0; i < values.length; i++) {
    const current = values[i]
    sums.push(current)
    val += current
    while (val > search) {
      const rem = sums.shift()
      val -= rem
    }
    if (val == search) {
      console.log("found", val, sums)
      let f = Math.min(...sums)
      let l = Math.max(...sums)
      console.log("sum", f, l, "=", f + l)

    }
  }

});
// 3474524, 4754251