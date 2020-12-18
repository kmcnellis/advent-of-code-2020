var fs = require('fs');
import { combinations, ceil } from 'mathjs';
import _ from 'lodash';

class Layout {
  cells: Array<Array<Array<Array<Cell>>>>;
  round: number;
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(contents: string) {
    this.cells = [[contents.trim().split("\n").map(
      (x: string): Array<Cell> => {
        return x.trim().split("").map(
          (y: string): Cell => {
            if (y == ".") return new Cell(false)
            if (y == "#") return new Cell(true)
          }
        );
      }
    )]];
    this.w = this.cells.length
    this.z = this.cells[0].length
    this.x = this.cells[0][0].length;
    this.y = this.cells[0][0][0].length;
    this.round = 0
    this.expandBoard()
  }

  expandBoard() {
    for (let h = 0; h < this.w; h++) {
      for (let i = 0; i < this.z; i++) {
        for (let j = 0; j < this.x; j++) {
          this.cells[h][i][j].push(new Cell(false))
          this.cells[h][i][j].unshift(new Cell(false))
        }
        this.cells[h][i].push(Array.from(Array(this.y + 2), () => new Cell(false)))
        this.cells[h][i].unshift(Array.from(Array(this.y + 2), () => new Cell(false)))
      }
      this.cells[h].push(Array.from(Array(this.x + 2), () =>
        Array.from(Array(this.y + 2), () => new Cell(false))))
      this.cells[h].unshift(Array.from(Array(this.x + 2), () =>
        Array.from(Array(this.y + 2), () => new Cell(false))))
    }
    this.cells.push(Array.from(Array(this.z + 2), () =>
      Array.from(Array(this.x + 2), () =>
        Array.from(Array(this.y + 2), () => new Cell(false))
      )
    ))
    this.cells.unshift(Array.from(Array(this.z + 2), () =>
      Array.from(Array(this.x + 2), () =>
        Array.from(Array(this.y + 2), () => new Cell(false))
      )
    ))

    this.x += 2
    this.y += 2
    this.z += 2
    this.w += 2
  }

  runRound(): boolean {
    this.expandBoard()
    let changed = false

    let newLayout = _.cloneDeep(this.cells)
    // possibleFields: Array.from(Array(myTicket.length), (i, index) => index)

    for (let h = 1; h < this.w - 1; h++) {
      for (let i = 1; i < this.z - 1; i++) {
        for (let j = 1; j < this.x - 1; j++) {
          for (let k = 1; k < this.y - 1; k++) {
            const n = this.filledNeighbors(h, i, j, k)
            if (this.cells[h][i][j][k] == null) {
              console.log(h, i, j, k, "not filled")
            } else {
              if (this.cells[h][i][j][k].active()) {
                if (!(n == 2 || n == 3)) {
                  changed = newLayout[h][i][j][k].deactivate() || changed
                  // console.log("   deactivate ", h,i, j, k)
                }
              }
              else if (!this.cells[h][i][j][k].active()) {
                if (n == 3) {
                  changed = newLayout[h][i][j][k].activate() || changed
                  // console.log("   activate ", h,i, j, k)
                }
              }
            }
          }
        }
      }
    }
    this.round += 1
    this.cells = newLayout
    return changed
  }

  filledNeighbors(w: number, z: number, x: number, y: number): number {
    // console.log(`row ${row}/${this.rows} :  ${col}/${this.columns}`)
    // console.log(`[${row},${col}] : ${this.seats[row][col].toString()}`)
    let c = 0
    for (let h = w - 1; h <= w + 1; h++) {
      for (let i = z - 1; i <= z + 1; i++) {
        for (let j = x - 1; j <= x + 1; j++) {
          for (let k = y - 1; k <= y + 1; k++) {
            if (this.cells[h][i][j][k] == null) {
              console.log(i, j, k, "not filled")
            } else if (h == w && i == z && j == x && k == y) {
              continue;
            } else if (this.cells[h][i][j][k].active()) {
              c += 1
            }
          }
        }
      }
    }
    return c
  }

  count(): number {
    let c = 0
    for (let h = 0; h < this.w; h++) {
      for (let i = 0; i < this.z; i++) {
        for (let j = 0; j < this.x; j++) {
          for (let k = 0; k < this.y; k++) {
            if (this.cells[h][i][j][k] == null) {
              console.log(h, i, j, k, "not filled")
            } else if (this.cells[h][i][j][k].active()) c++
          }
        }
      }
    }
    return c
  }
  toString(): string {
    let out = `Round ${this.round}:\n`
    out += `Active: ${this.count()}\n`
    for (let h = 1; h < this.w - 1; h++) {
      for (let i = 1; i < this.z - 1; i++) {
        out += `z=${i}, w=${h}\n`
        for (let j = 1; j < this.x - 1; j++) {
          for (let k = 1; k < this.y - 1; k++) {
            if (this.cells[h][i][j][k] == null) {
              out += "- "
            } else {
              out += this.cells[h][i][j][k].toString() + " "
            }
          }
          out += "\n"
        }
        out += "\n"
        out += "\n"
      }
    }
    return out
  }
}

class Cell {
  on: boolean;
  constructor(f: boolean) {
    this.on = f
  }
  active(): boolean {
    return this.on
  }
  activate(): boolean {
    if (this.on) return false
    this.on = true
    return true
  }
  deactivate(): boolean {
    if (!this.on) return false
    this.on = false
    return true
  }
  toString(): string {
    if (this.on) return "#"
    return "."
  }

}


fs.readFile('input.txt', 'utf8', async function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const cells = new Layout(contents)
  console.log("Starting cells")
  console.log(cells.toString())
  for (let i = 0; i < 6; i++) {
    cells.runRound()
    console.log(cells.toString())
  }
  console.log("Filled cells:", cells.count())
});
