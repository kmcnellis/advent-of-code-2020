import fs from 'fs';

interface Instruction {
  op: string;
  arg: number;
}
const opRegex = new RegExp(/^(\w{3}) \+?(-?\d*)$/m);

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const instructions: Array<Instruction> = contents.trim().split("\n").map(
    (x: string): Instruction => {
      const res = x.match(opRegex);
      if (res == null) {
        console.log("error parsing", x);
        return null;
      }
      return {
        op: res[1],
        arg: parseInt(res[2])
      };
    }
  );
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].op != "acc") {
      const code = Array.from(instructions);
      code[i] = {
        op: (code[i].op == "nop" ? "jpm" : "nop"),
        arg: code[i].arg
      };
      try {
        const result = runComputer(code);
        console.log("result found on", i, ":", result);
      }
      catch (err) {
        // console.log("result not", i, err)
      }
    }
  }
});

const runComputer = (code: Array<Instruction>): number => {
  const visited: Set<number> = new Set();
  let acc = 0;
  let index = 0;

  while (index != code.length) {
    if (visited.has(index)) {
      throw new Error("Infinite loop at " + index);
    }
    visited.add(index);
    const inst = code[index];
    switch (inst.op) {
      case "nop":
        index += 1;
        break;
      case "acc":
        index += 1;
        acc += inst.arg;
        break;
      case "jmp":
        index += inst.arg;
        break;
    }
  }
  return acc;
};