var fs = require('fs');

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  var values = contents.trim().split("\n").map(
    (x) => {
      const vals = x.trim().split(" ")
      const amt = vals[0].split("-").map(x => parseFloat(x));
      return {
        min: amt[0],
        max: amt[1],
        letter: vals[1].substring(0, vals[1].length - 1),
        password: vals[2],
      }
    }
  );

  let count = 0
  values.forEach(v => {
    if ((v.password[v.min - 1] == v.letter) !== (v.password[v.max - 1] == v.letter)) {
      count += 1;
    }
  });
  console.log("count:", count)
});

