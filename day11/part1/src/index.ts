import fs from 'fs';
import _ from 'lodash';

class Layout {
  seats: Array<Array<Place>>;
  round: number;
  rows: number;
  columns: number;

  constructor(contents: string) {
    this.seats = contents.trim().split("\n").map(
      (x: string): Array<Place> => {
        return x.trim().split("").map(
          (y: string): Place => {
            if (y == ".") return new Floor;
            if (y == "L") return new Seat(false);
            if (y == "#") return new Seat(true);
          }
        );
      }
    );
    this.rows = this.seats.length;
    this.columns = this.seats[0].length;
    this.round = 0;
  }

  runRound(): boolean {
    let changed = false;
    const newSeats = _.cloneDeep(this.seats);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const n = this.filledNeighbors(i, j);
        if (n >= 4) {
          changed = newSeats[i][j].stand() || changed;
          // console.log("   stand " + newSeats[i][j])
        }
        else if (n == 0) {
          changed = newSeats[i][j].sit() || changed;
          // console.log("   sit " + newSeats[i][j])
        }
      }
    }
    this.round += 1;
    this.seats = newSeats;
    return changed;
  }

  filledNeighbors(row: number, col: number): number {
    // console.log(`row ${row}/${this.rows} :  ${col}/${this.columns}`)
    // console.log(`[${row},${col}] : ${this.seats[row][col].toString()}`)
    let c = 0;
    if (row != 0) {
      if (this.seats[row - 1][col].occupied()) {
        c++;
        // console.log(`   found ${row - 1},${col} front ${this.seats[row - 1][col].toString()}`)

      } // front
      if (col != 0) {
        if (this.seats[row - 1][col - 1].occupied()) {
          c++;
          // console.log(`   found ${row - 1},${col - 1} front-left ${this.seats[row - 1][col - 1].toString()}`)
        } // front-left
      }
      if (col != this.columns - 1) {
        if (this.seats[row - 1][col + 1].occupied()) {
          c++;
          // console.log(`   found ${row - 1},${col + 1} front-right ${this.seats[row - 1][col + 1].toString()}`)
        } // front-right
      }
    }
    if (row != this.rows - 1) {
      if (this.seats[row + 1][col].occupied()) {
        c++;
        // console.log(`   found ${row + 1},${col} behind ${this.seats[row + 1][col].toString()}`)

      } // behind
      if (col != 0) {
        if (this.seats[row + 1][col - 1].occupied()) {
          c++;
          // console.log(`   found ${row + 1},${col - 1} back-left ${this.seats[row + 1][col - 1].toString()}`)
        } // back-left
      }
      if (col != this.columns - 1) {
        if (this.seats[row + 1][col + 1].occupied()) {
          c++;
          // console.log(`   found ${row + 1},${col + 1} back-right ${this.seats[row + 1][col + 1].toString()}`)
        } // back-right
      }

    }
    if (col != 0) {
      if (this.seats[row][col - 1].occupied()) {
        c++;
        // console.log(`   found ${row},${col - 1} left ${this.seats[row][col - 1].toString()}`)

      } // left
    }
    if (col != this.columns - 1) {
      if (this.seats[row][col + 1].occupied()) {
        c++;
        // console.log(`   found ${row},${col + 1} right ${this.seats[row][col + 1].toString()}`)

      } // right
    }

    return c;
  }

  count(): number {
    let c = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.seats[i][j].occupied()) c++;
      }
    }
    return c;
  }
  toString(): string {
    let out = `Round ${this.round}:\n`;
    for (let i = 0; i < this.rows; i++) {
      out += this.seats[i].join("") + "\n";
    }
    return out;
  }
}
class Place {
  occupied(): boolean { return false; }
  sit(): boolean { return false; }
  stand(): boolean { return false; }
  toString(): string { return ""; }
}

class Seat extends Place {
  filled: boolean;
  constructor(f: boolean) {
    super();
    this.filled = f;
  }
  occupied(): boolean {
    return this.filled;
  }
  sit(): boolean {
    if (this.filled) return false;
    this.filled = true;
    return true;
  }
  stand(): boolean {
    if (!this.filled) return false;
    this.filled = false;
    return true;
  }
  toString(): string {
    if (this.filled) return "#";
    return "L";
  }

}

class Floor extends Place {
  toString(): string {
    return ".";
  }
}


fs.readFile('input.txt', 'utf8', async function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const seats = new Layout(contents);
  console.log("seats");
  console.log(seats.toString());
  await new Promise(r => setTimeout(r, 200));
  console.clear();

  while (seats.runRound()) {
    console.log(seats.toString());
    await new Promise(r => setTimeout(r, 200));
    console.clear();
  }
  console.log("Filled seats:", seats.count());
});

const compare = (a: number, b: number): number => a - b;
