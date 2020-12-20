import fs from 'fs';

class Ship {
  x: number;
  y: number;
  waypointX: number;
  waypointY: number;

  facing: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.waypointX = 1;
    this.waypointY = 10;
  }

  move(direction: string, amount: number) {

    switch (direction) {
      // Action N means to move the waypoint north by the given value.
      case "N":
        this.waypointX += amount;
        break;
      // Action S means to move the waypoint south by the given value.
      case "S":
        this.waypointX -= amount;
        break;
      // Action E means to move the waypoint east by the given value.
      case "E":
        this.waypointY += amount;
        break;
      // Action W means to move the waypoint west by the given value.
      case "W":
        this.waypointY -= amount;
        break;
      // Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
      case "L":
        for (let i = 0; i < amount; i += 90) {
          const newY = this.waypointX * -1;
          this.waypointX = this.waypointY;
          this.waypointY = newY;
          // -1, 1 ->  1, 1
          // -1,-1 -> -1, 1
          //  1,-1 -> -1,-1
          //  1, 1 ->  1,-1
          //  x = y
          //  y = -x
        }
        break;
      // Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
      case "R":
        for (let i = 0; i < amount; i += 90) {
          const newX = this.waypointY * -1;
          this.waypointY = this.waypointX;
          this.waypointX = newX;
          //  1, 1 -> -1, 1
          // -1, 1 -> -1,-1
          // -1,-1 ->  1,-1
          //  1,-1 ->  1, 1
          //  x = -y
          //  y = x
        }
        break;
      // Action F means to move forward to the waypoint a number of times equal to the given value.
      case "F":
        this.x += amount * this.waypointX;
        this.y += amount * this.waypointY;
        break;
      default:
        console.error("error in direction:", direction);
    }
  }

  toString(): string {
    const out = `Position (${this.x},${this.y}); Waypoint (${this.waypointX},${this.waypointY});`;
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
  console.log(instructions);
  console.log(ship.toString());

  instructions.forEach((inst) => {
    ship.move(inst.direction, inst.amount);
    console.log(inst, ship.toString());

  });
  console.log(ship.toString());
  console.log("Distance:", ship.distance());
});

const compare = (a: number, b: number): number => a - b;
