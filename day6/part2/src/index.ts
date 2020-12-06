var fs = require('fs');

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  let count = 0
  const questions: Array<number> = contents.trim().split("\n\n").map(
    (x: string): number => {
      let qs: Set<string> = new Set()
      let first = true
      x.trim().split("\n").forEach(
        (y: string) => {
          let iq = new Set(y.trim().split(""))
          if (first) {
            qs = iq
          }
          first = false
          qs = new Set([...qs].filter(i => iq.has(i)));
        });
      count += qs.size

      return qs.size;
    }
  );
  console.log("Count:", count)
});
