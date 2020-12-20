import fs from 'fs';
import { mod } from 'mathjs';

class Ship {
  x: number;
  y: number;
  facing: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.facing = 0;
  }

  move(direction: string, amount: number) {
    switch (direction) {
      // Action N means to move north by the given value.
      case "N":
        this.x += amount;
        break;
      // Action S means to move south by the given value.
      case "S":
        this.x -= amount;
        break;
      // Action E means to move east by the given value.
      case "E":
        this.y += amount;
        break;
      // Action W means to move west by the given value.
      case "W":
        this.y -= amount;
        break;
      // Action L means to turn left the given number of degrees.
      case "L":
        this.facing += amount;
        break;
      // Action R means to turn right the given number of degrees.
      case "R":
        this.facing -= amount;
        break;
      // Action F means to move forward by the given value in the direction the ship is currently facing.
      case "F":
        switch (mod(this.facing, 360)) {
          case 0: // east
            this.y += amount;

            break;
          case 90: // north
            this.x += amount;

            break;
          case 180: // west
            this.y -= amount;

            break;
          case 270: // south
            this.x -= amount;

            break;
          default:
            console.error("We're not facing a cardinal direction:", mod(this.facing, 360));
        }
        break;
      default:
        console.error("error in direction:", direction);
    }
  }

  toString(): string {
    const out = `Position (${this.x},${this.y})`;
    return out;
  }
  distance(): number {
    return Math.abs(this.x) + Math.abs(this.y);
  }
}

fs.readFile('input.txt', 'utf8', async function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const ship = new Ship();
  const instructions: Array<{ direction: string, amount: number }> = contents.trim().split("\n").map(
    (x: string): { direction: string, amount: number } => {
      return {
        direction: x[0],
        amount: parseInt(x.substr(1))
      };
    });

  instructions.forEach((inst) => {
    ship.move(inst.direction, inst.amount);
  });
  console.log(ship.toString());
  console.log("Distance:", ship.distance());
});

const compare = (a: number, b: number): number => a - b;
