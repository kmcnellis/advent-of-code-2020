var fs = require('fs');

interface Category {
  name: string;
  rangeA: Condition;
  rangeB: Condition;
  possibleFields: Array<number>
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
  let input = contents.trim().split("\n\n")
  let myTicket = input[1].trim().split("\n")[1].split(",")

  let fields = input[0].trim().split("\n").map(
    (x: string): Category => {
      const r = new RegExp(/^([\w ]*): (\d*)-(\d*) or (\d*)-(\d*)$/m)
      const res = x.match(r)
      if (res == null) {
        console.log(x, "issue with regex")
        return
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
        possibleFields: Array.from(Array(myTicket.length), (i, index) => index)
      }
    }
  );
  console.log("fields", fields)
  let tickets = input[2].trim().split("\n").slice(1).map(
    (x: string): Array<number> => {
      return x.trim().split(",").map(
        (y: string): number => {
          return parseInt(y);
        });
    }).filter(
      (x: Array<number>) => {
        let validTicket = true
        x.forEach(
          (val: number) => {
            let valid = false;
            for (let i = 0; i < fields.length; i++) {
              const test = fields[i]
              if ((val >= test.rangeA.start && val <= test.rangeA.end) ||
                (val >= test.rangeB.start && val <= test.rangeB.end)) {
                valid = true;
                break;
              }
            }
            if (!valid) {
              validTicket = false;
            }
          });
        return validTicket;
      });

  tickets.forEach(
    (x: Array<number>) => {
      for (let i = 0; i < x.length; i++) {
        const val = x[i]

        for (let j = 0; j < fields.length; j++) {
          const test = fields[j]
          if (test.possibleFields.includes(i)) {
            if (!(val >= test.rangeA.start && val <= test.rangeA.end) &&
              !(val >= test.rangeB.start && val <= test.rangeB.end)) {
              test.possibleFields = test.possibleFields.filter(z => z !== i)
              console.log(`field ${i} not allowed in ${test.name} due to value ${val}`, test.possibleFields)
            }
          }
        }
      }
    });

  let done = false
  let assigned: Array<number> = []
  while (!done) {
    done = true
    for (let i = 0; i < fields.length; i++) {
      const test = fields[i]
      if (test.possibleFields.length > 1) {
        test.possibleFields = test.possibleFields.filter((z) => !assigned.includes(z))
      }

      if (test.possibleFields.length <= 1) {
        if (!assigned.includes(test.possibleFields[0])) {
          assigned.push(test.possibleFields[0])
        }
      } else {
        done = false
      }
    }
  }
  for (let i = 0; i < fields.length; i++) {
    const test = fields[i]
    console.log(`field "${test.name}" is position ${test.possibleFields[0]}`)
  }
  for (let i = 0; i < fields.length; i++) {
    const test = fields[i]
    const f = test.possibleFields[0]
    console.log(`"${test.name}" : ${myTicket[f]}`)
  }


});
