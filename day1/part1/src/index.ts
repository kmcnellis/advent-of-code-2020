var fs = require('fs');

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  var values = contents.trim().split("\n").map(x => parseFloat(x));
  for (let i = 0; i < values.length; i++) {
    const first = values[i];
    if (first > 2020) {
      continue;
    }
    for (let j = 0; j < values.length; j++) {
      const second = values[j];
      if (first + second == 2020) {
        console.log(`${first} + ${second} = ${first + second}`)
        console.log(`${first} * ${second} = ${first * second}`)
      }
    }

  }

});

