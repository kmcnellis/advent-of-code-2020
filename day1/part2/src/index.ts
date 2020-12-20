import fs from 'fs';

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const values = contents.trim().split("\n").map(x => parseFloat(x));
  const storage = new Array(values.length ^ 2);
  let s = 0, first = 0, second = 0, v = 0;
  for (let i = 0; i < values.length; i++) {
    first = values[i];
    if (first >= 2020) {
      continue;
    }
    for (let j = 0; j < values.length; j++) {
      second = values[j];
      v = first + second;
      if (v >= 2020) {
        continue;
      }
      storage[s] = { value: v, first: first, second: second };
      s++;
    }
  }
  for (let i = 0; i < s; i++) {
    first = storage[i].value;
    for (let j = 0; j < values.length; j++) {
      second = values[j];
      if (first + second == 2020) {
        console.log(`${storage[i].first} + ${storage[i].second} + ${second} = ${storage[i].first + storage[i].second + second}`);
        console.log(`${storage[i].first} * ${storage[i].second} * ${second} = ${storage[i].first * storage[i].second * second}`);
      }
    }
  }

});

