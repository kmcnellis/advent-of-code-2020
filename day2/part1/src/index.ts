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
    const regex = new RegExp(v.letter, 'g')
    const n = (v.password.match(regex) || []).length
    if (n <= v.max && n >= v.min) {
      count += 1;
    }
  });
  console.log("count:", count)
});

