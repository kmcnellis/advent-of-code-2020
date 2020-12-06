var fs = require('fs');

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const questions: Array<{ [key: string]: boolean }> = contents.trim().split("\n\n").map(
    (x: string): { [key: string]: boolean } => {
      let qs: { [key: string]: boolean } = {};
      x.trim().split("\n").forEach(
        (y: string) => {
          y.trim().split("").forEach(
            (z: string) => {
              qs[z] = true
            });
        });
      return qs;
    }
  );
  console.log("questions", questions)

  let count = 0
  questions.forEach((q => {
    const k = Object.keys(q)
    count += k.length
  }))
  console.log("Count:", count)
});
