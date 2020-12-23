import fs from 'fs';
import * as math from 'mathjs';

class Cup {
  label: number;
  next: Cup;
  constructor(label: number) {
    this.label = label;
  }
  print() {
    let out = "";
    out += this.label + ", ";
    let currentCup = this.next;
    while (currentCup.label != this.label) {
      out += currentCup.label + ", ";
      currentCup = currentCup.next;
    }
    console.log(out);
  }
}
fs.readFile('input.txt', 'utf8', function(err: Error, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }

  const length = 1000000;
  const labels = contents.trim().split("").map((x: string) => {
    return parseInt(x);
  });
  const cups = Array.from({ length: length + 1 }, (_, i) => {
    if (i == 0) return null;
    return new Cup(i);
  });

  const firstCup = cups[labels[0]];

  let prevCup = firstCup;
  let index = 0;
  for (let i = 1; i < length; i++) {
    index = i + 1;
    if (i < labels.length) {
      index = labels[i];
    }
    prevCup.next = cups[index];
    prevCup = prevCup.next;
  }
  prevCup.next = firstCup;

  let dest: Cup;
  let d: number;
  let pickup: Cup;
  let pickupMiddle: Cup;
  let pickupLast: Cup;

  const rounds = 10000000;
  let current = firstCup;
  for (let round = 1; round <= rounds; round++) {
    pickup = current.next;
    pickupMiddle = pickup.next;
    pickupLast = pickupMiddle.next;

    current.next = pickupLast.next;
    pickupLast.next = null;

    d = current.label - 1;
    if (d <= 0) { d = length; }
    while (d == pickup.label ||
      d == pickupMiddle.label ||
      d == pickupLast.label) {
      d = d - 1;
      if (d <= 0) { d = length; }
    }
    dest = cups[d];

    pickupLast.next = dest.next;
    dest.next = pickup;

    current = current.next;

  }
  console.log("FINAL cups:");

  const oneIndex = cups[1];
  console.log(oneIndex.label, oneIndex.next.label, oneIndex.next.next.label, oneIndex.next.next.next.label);
  // oneIndex.print();
});

const compare = (a: number, b: number): number => a - b;
