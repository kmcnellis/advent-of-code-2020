import fs from 'fs';

interface Category {
  name: string;
  rangeA: Condition;
  rangeB: Condition;
}
interface Condition {
  start: number;
  end: number;
}


fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const input = contents.trim().split("\n\n");

  const fields = input[0].trim().split("\n").map(
    (x: string): Category => {
      const r = new RegExp(/^([\w ]*): (\d*)-(\d*) or (\d*)-(\d*)$/m);
      const res = x.match(r);
      if (res == null) {
        console.log(x, "issue with regex");
        return;
      }

      return {
        name: res[1],
        rangeA: {
          start: parseInt(res[2]),
          end: parseInt(res[3]),
        },
        rangeB: {
          start: parseInt(res[4]),
          end: parseInt(res[5]),
        },
      };
    }
  );
  console.log("fields", fields);
  let errors = 0;
  input[2].trim().split("\n").forEach(
    (x: string) => {
      if (x == "nearby tickets:") {
        return;
      }
      x.trim().split(",").forEach(
        (y: string) => {
          const val = parseInt(y);
          let valid = false;
          for (let i = 0; i < fields.length; i++) {
            const test = fields[i];
            if ((val >= test.rangeA.start && val <= test.rangeA.end) ||
              (val >= test.rangeB.start && val <= test.rangeB.end)) {
              valid = true;
              break;
            }
          }
          if (!valid) {
            errors += val;
            console.log(`${val} not valid`);
          }
        });
    });
  console.log(`error rate:${errors}`);

});
