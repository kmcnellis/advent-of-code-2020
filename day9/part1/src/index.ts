var fs = require('fs');

const preamble = 25
interface Sums {
  value: number;
  componentA: number;
  indexA: number;
  componentB: number;
  indexB: number;
  lower: number
}

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
  const sums: { [key: number]: Sums } = {}
  for (let i = 0; i < values.length; i++) {
    let lower = i - preamble - 1
    if (lower >= 0) {
      for (let key in sums) {
        if (sums.hasOwnProperty(key) && sums[key].lower < lower) {
          // console.log(i, ": delete", key, ":", sums[key].indexA, sums[key].indexB, "<=", lower)
          delete sums[key]
        }
      }
    }
    lower = Math.max(lower, 0)
    for (let j = lower; j < i; j++) {
      const s = values[i] + values[j]
      if (!(s in sums) || (sums[s].lower < j)) {
        sums[s] = {
          value: s,
          componentA: values[i],
          indexA: i,
          componentB: values[j],
          indexB: j,
          lower: j
        }
        // console.log(i, ": add", s, ":", i, j)
      }
      else {
        // console.log(i, ": skip", s, ":", i, j, !(s in sums))

      }
    }
    if (i >= preamble) {
      if (!(values[i] in sums)) {
        // console.log(sums)
        console.log("Value", i, "missing sums:", values[i])
        return
      }
    }
  }

});
