import fs from 'fs';
import { mod } from 'mathjs';

fs.readFile('input.txt', 'utf8', function(err: Error, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const keys = contents.trim().split("\n").map(
    (x: string) => {
      return parseInt(x);
    }
  );

  const loop = [0, 0];
  loop[0] = transformSearch(keys[0], 7);
  loop[1] = transformSearch(keys[1], 7);
  console.log(loop);

  const final = [0, 0];
  final[0] = transform(loop[0], keys[1]);
  final[1] = transform(loop[1], keys[0]);
  console.log(final);

});

const transformSearch = (target: number, subject: number): number => {

  let calc = 1;
  let loops = 0;
  console.log("target", target);
  while (calc != target) {
    calc = mod(calc * subject, 20201227);
    loops++;
    // console.log(calc, loops);
  }
  return loops;
};

const transform = (loops: number, subject: number): number => {

  let calc = 1;
  for (let i = 0; i < loops; i++) {
    calc = mod(calc * subject, 20201227);
  }
  return calc;
};