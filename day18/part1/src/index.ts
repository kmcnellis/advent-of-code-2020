var fs = require('fs');

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  let sum = 0
  contents.trim().split("\n").forEach(
    (x: string) => {
      let eq = x.trim().split("")
      let v = calculate(eq, 0, eq.length)
      console.log(x, "=", v)
      sum += v
    }
  );
  console.log("sum", "=", sum)

});

let calculate = (eq: Array<string>, start: number, end: number): number => {
  let calc = 0
  let op = "+"
  let first = true;
  // console.log("start", eq.slice(start, end).join(""))
  for (let i = start; i < end; i++) {
    if (eq[i] == "+") {
      op = "+"
    }
    else if (eq[i] == "*") {
      op = "*"
    }
    else if (eq[i] == " " || eq[i] == "") {
      //nothing
    } else {
      let val = 0
      if (eq[i] == "(") {
        let nest = 1
        for (let j = i + 1; j < end; j++) {
          if (eq[j] == "(") {
            nest += 1
          }
          if (eq[j] == ")") {
            nest -= 1
            if (nest == 0) {
              // console.log("sub", i, j)
              val = calculate(eq, i + 1, j)
              i = j
              break;
            }
          }
        }
      } else {
        val = parseInt(eq[i])
      }
      // console.log(`${calc} ${op} ${val}`)

      if (op == "+") {
        calc += val
      } else {
        if (first) {
          calc = val
        } else {
          calc = calc * val
        }
      }
      // console.log(`= ${calc} (${first})`)
      first = false

    }
  }
  console.log(eq.slice(start, end).join(""), "=", calc)

  return calc
}