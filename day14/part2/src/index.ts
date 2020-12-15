var fs = require('fs');
import { combinations, ceil } from 'mathjs';

class Mask {
  masked: boolean;
  value: string;
  constructor(x: string) {
    this.value = x
    if (x == "X") {
      this.masked = false
    }
    else {
      this.masked = true
    }
  }
}

class Instruction {
  mem: number;
  value: number;
  constructor(x: string) {
    const r = new RegExp(/^mem\[(\d*)\] = (\d*)$/m)
    const res = x.match(r)
    if (res == null) {
      console.log(x, "issue with regex")
      return
    }
    this.mem = parseInt(res[1])
    this.value = parseInt(res[2])
  }
}

const generate = (mask: Array<Mask>, x: number): Array<number> => {
  let bin = x.toString(2).padStart(mask.length, "0")
  return apply(mask, bin, 0)
}

const apply = (mask: Array<Mask>, bin: string, pos: number): Array<number> => {
  // console.log("start", bin, pos)
  for (let i = pos; i < mask.length; i++) {
    if (!mask[i].masked) {
      let test0 = bin.substr(0, i) + "0" + bin.substr(i + 1);
      let test1 = bin.substr(0, i) + "1" + bin.substr(i + 1);
      return [].concat(...apply(mask, test0, i + 1), ...apply(mask, test1, i + 1))
    }
    if (mask[i].value == "1") {
      bin = bin.substr(0, i) + "1" + bin.substr(i + 1);
    }
  }
  // console.log("end", bin, parseInt(bin, 2))
  return [parseInt(bin, 2)]
}

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  let memory: { [key: number]: number } = {}
  contents.trim().split("mask = ").forEach((c: string) => {
    const data: Array<string> = c.trim().split("\n")

    const mask: Array<Mask> = data[0].trim().split("").map(
      (x: string): Mask => {
        return new Mask(x)
      }
    );

    const instructions: Array<Instruction> = data.slice(1).map(
      (x: string): Instruction => {
        return new Instruction(x)
      }
    );
    instructions.forEach(i => {
      let v = generate(mask, i.mem)
      // console.log(v)
      v.forEach(pos => {
        memory[pos] = i.value

      })
    })
  })
  let result = sum(Object.values(memory))
  console.log(memory)
  console.log("result", result)

});

let sum = (arr: Array<number>): bigint => {
  return arr.reduce(function(a, b) {
    return BigInt(a) + BigInt(b)
  }, BigInt(0));
}

const compare = (a: number, b: number): number => a - b;
