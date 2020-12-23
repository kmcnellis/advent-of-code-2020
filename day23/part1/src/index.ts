import fs from 'fs';
import * as math from 'mathjs';

fs.readFile('input.txt', 'utf8', function(err: Error, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }

  const cups = contents.trim().split("").map((x: string) => {
    return parseInt(x);
  });
  console.log(cups);

  const max = math.max(cups);
  const min = math.min(cups);
  let c = cups[0];
  let index = 0;
  let dest = 0;
  let destIndex = 0;
  let pickup: Array<number> = [];
  let dTry = 0;
  const length = cups.length;

  for (let round = 1; round <= 100; round++) {
    console.log(`-- move ${round} --`);
    console.log("cups:", cups);
    c = cups[index];
    console.log("selected:", c);
    pickup = cups.splice(index + 1, 3);
    if (pickup.length < 3) {
      console.log("more!", 3 - pickup.length);
      pickup.splice(pickup.length, 0, ...cups.splice(0, 3 - pickup.length));
    }
    console.log("pickup:", pickup);
    dest = c - 1;
    dTry = 0;
    if (cups.indexOf(dest) == -1) {
      for (; dest > 0; dest--) {
        if (cups.indexOf(dest) != -1) {
          break;
        }
      }
    }
    if (cups.indexOf(dest) == -1) {
      for (dest = max; dest > 0; dest--) {
        if (cups.indexOf(dest) != -1) {
          break;
        }
      }
    }

    destIndex = math.mod(cups.indexOf(dest) + 1, length);
    console.log("destination:", dest, destIndex);
    cups.splice(destIndex, 0, ...pickup);
    index = math.mod(cups.indexOf(c) + 1, length);
  }
  console.log("FINAL cups:", cups);

  const oneIndex = cups.indexOf(1);
  let final = "";
  for (let i = oneIndex + 1; i < oneIndex + length; i++) {
    final += `${cups[math.mod(i, length)]}`;
  }
  console.log("ordered:", final);

});

const compare = (a: number, b: number): number => a - b;
