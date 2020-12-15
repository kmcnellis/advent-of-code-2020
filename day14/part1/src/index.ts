var fs = require('fs');

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

const apply = (mask: Array<Mask>, x: number): number => {
  let result = x.toString(2).padStart(mask.length, "0")
  console.log(x, result)
  for (let i = 0; i < mask.length; i++) {
    if (mask[i].masked) {
      result = result.substr(0, i) + mask[i].value + result.substr(i + 1);
    }
  }
  return parseInt(result, 2)
}

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  let memory: { [key: number]: number } = {}
  contents.trim().split("mask = ").forEach((c: string) => {
    const data: Array<string> = c.trim().split("\n")

    console.log(data[0])
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
      let v = apply(mask, i.value)
      memory[i.mem] = v
    })
  })
  let result = sum(Object.values(memory))
  console.log(memory)
  console.log("result", result)

});

let sum = (arr: Array<number>): number => {
  return arr.reduce(function(a, b) {
    return a + b
  }, 0);
}
