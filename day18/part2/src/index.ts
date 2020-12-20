import fs from 'fs';

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  let sum = 0;
  contents.trim().split("\n").forEach(
    (x: string) => {
      const eq = x.trim().split("");
      const v = calculate(eq, 0, eq.length);
      console.log(x, "=", v);
      sum += v;
    }
  );
  console.log("sum", "=", sum);

});

const calculate = (eq: Array<string>, start: number, end: number): number => {
  let calc = 0;
  let first = true;
  // console.log("start", eq.slice(start, end).join(""))
  for (let i = start; i < end; i++) {
    if (eq[i] == "+" || eq[i] == " " || eq[i] == "") {
    }
    else if (eq[i] == "*") {
      let val = 0;
      let nest = 0;
      for (let j = i + 1; j < end; j++) {
        if (eq[j] == "(") {
          nest += 1;
        }
        if (eq[j] == ")") {
          nest -= 1;
        }
        if (nest == 0 && eq[j] == "*") {
          // console.log("sub *", i, j, ":", eq.slice(i + 1, j).join(""))
          val = calculate(eq, i + 1, j);
          i = j - 1;
          break;
        }
        if (j == end - 1) {
          // console.log("sub |", i, j, ":", eq.slice(i + 1, j + 1).join(""))
          val = calculate(eq, i + 1, j + 1);
          i = j;
          break;
        }
      }
      // console.log(`${calc} * ${val}`)
      if (first) {
        calc = val;
      } else {
        calc = calc * val;
      }
      // console.log(`= ${calc} (${first})`)
    }
    else if (eq[i] == "(") {
      let val = 0;
      let nest = 1;
      for (let j = i + 1; j < end; j++) {
        if (eq[j] == "(") {
          nest += 1;
        }
        if (eq[j] == ")") {
          nest -= 1;
        }
        if (nest == 0) {
          if (eq[j] == ")") {
            // console.log("sub ()", i, j, ":", eq.slice(i + 1, j).join(""))
            val = calculate(eq, i + 1, j);
            i = j;
            break;
          }
        }
      }
      // console.log(`${calc} + ${val}`)
      calc += val;
      // console.log(`= ${calc} (${first})`)
    }
    else {
      const val = parseInt(eq[i]);
      // console.log(`${calc} + ${val}`)
      calc += val;
      // console.log(`= ${calc} (${first})`)
    }
    first = false;

  }

  // console.log(eq.slice(start, end).join(""), "=", calc)

  return calc;
};