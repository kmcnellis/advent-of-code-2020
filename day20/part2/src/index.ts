import fs from 'fs';
import { mod } from 'mathjs';

interface position {
  name: string
  rotation: number
  flip: boolean
}
class Tile {
  name: string
  contents: Array<Array<string>>
  rows: number
  columns: number
  rotation: number
  flip: boolean
  placed: boolean
  topNeighbor: position | null
  bottomNeighbor: position | null
  leftNeighbor: position | null
  rightNeighbor: position | null
  // flipped = false
  // rotation 0:
  // 012
  // 345
  // 678
  // rotation 1:
  // 258
  // 147
  // 036
  // rotation 2:
  // 876
  // 543
  // 210
  // rotation 3:
  // 630
  // 741
  // 852
  // flipped = true
  // rotation 0:
  // 210
  // 543
  // 876
  // rotation 1:
  // 852
  // 741
  // 630
  // rotation 2:
  // 678
  // 345
  // 012
  // rotation 3:
  // 036
  // 147
  // 258
  constructor(input: string) {
    const data = input.split("\n");
    this.name = data[0].trim();
    this.name = this.name.substring(0, this.name.length - 1);
    this.contents = [];
    this.topNeighbor = null;
    this.bottomNeighbor = null;
    this.leftNeighbor = null;
    this.rightNeighbor = null;
    this.rotation = 0;
    this.flip = false;
    this.placed = false;
    for (let i = 1; i < data.length; i++) {
      this.contents.push(data[i].trim().split(""));
    }
    this.rows = this.contents.length;
    this.columns = this.contents[0].length;
  }
  getNeighbor(dir: string): position | null {
    if (!this.flip) {
      switch (this.rotation) {
        case 0:
          switch (dir) {
            case "top":
              return this.rotateNeighbor(this.topNeighbor);
            case "right":
              return this.rotateNeighbor(this.rightNeighbor);
            case "bottom":
              return this.rotateNeighbor(this.bottomNeighbor);
            case "left":
              return this.rotateNeighbor(this.leftNeighbor);
          }
          break;
        case 1:
          switch (dir) {
            case "top":
              return this.rotateNeighbor(this.rightNeighbor);
            case "right":
              return this.rotateNeighbor(this.bottomNeighbor);
            case "bottom":
              return this.rotateNeighbor(this.leftNeighbor);
            case "left":
              return this.rotateNeighbor(this.topNeighbor);
          }
          break;
        case 2:
          switch (dir) {
            case "top":
              return this.rotateNeighbor(this.bottomNeighbor);
            case "right":
              return this.rotateNeighbor(this.leftNeighbor);
            case "bottom":
              return this.rotateNeighbor(this.topNeighbor);
            case "left":
              return this.rotateNeighbor(this.rightNeighbor);
          }
          break;
        case 3:
          switch (dir) {
            case "top":
              return this.rotateNeighbor(this.leftNeighbor);
            case "right":
              return this.rotateNeighbor(this.topNeighbor);
            case "bottom":
              return this.rotateNeighbor(this.rightNeighbor);
            case "left":
              return this.rotateNeighbor(this.bottomNeighbor);
          }
          break;
      }
    }
    else {
      switch (this.rotation) {
        case 0:
          switch (dir) {
            case "top":
              return this.rotateNeighbor(this.topNeighbor);
            case "right":
              return this.rotateNeighbor(this.leftNeighbor);
            case "bottom":
              return this.rotateNeighbor(this.bottomNeighbor);
            case "left":
              return this.rotateNeighbor(this.rightNeighbor);
          }
          break;
        case 1:
          switch (dir) {
            case "top":
              return this.rotateNeighbor(this.rightNeighbor);
            case "right":
              return this.rotateNeighbor(this.topNeighbor);
            case "bottom":
              return this.rotateNeighbor(this.leftNeighbor);
            case "left":
              return this.rotateNeighbor(this.bottomNeighbor);
          }
          break;
        case 2:
          switch (dir) {
            case "top":
              return this.rotateNeighbor(this.bottomNeighbor);
            case "right":
              return this.rotateNeighbor(this.rightNeighbor);
            case "bottom":
              return this.rotateNeighbor(this.topNeighbor);
            case "left":
              return this.rotateNeighbor(this.leftNeighbor);
          }
          break;
        case 3:
          switch (dir) {
            case "top":
              return this.rotateNeighbor(this.leftNeighbor);
            case "right":
              return this.rotateNeighbor(this.bottomNeighbor);
            case "bottom":
              return this.rotateNeighbor(this.rightNeighbor);
            case "left":
              return this.rotateNeighbor(this.topNeighbor);
          }
          break;
      }
    }
    return null;
  }
  rotateNeighbor(p: position | null): position | null {
    if (!p) return null;
    const f = p.flip ? !this.flip : this.flip;
    let r = mod(p.rotation + this.rotation, 4);

    if (p.flip) {
      r = mod(p.rotation - this.rotation, 4);
    }
    return {
      name: p.name,
      rotation: r,
      flip: f,
    };
  }

  row(i: number): string {
    if (i === -1) {
      i = this.rows - 1;
    }
    return this.contents[i].join("");
  }
  rowReverse(i: number): string {
    if (i === -1) {
      i = this.rows - 1;
    }
    return this.contents[i].map(x => x).reverse().join("");
  }
  column(i: number): string {
    if (i === -1) {
      i = this.columns - 1;
    }
    return this.contents.map(x => x[i]).join("");
  }
  columnReverse(i: number): string {
    if (i === -1) {
      i = this.columns - 1;
    }
    return this.contents.map(x => x[i]).reverse().join("");
  }
  rotatedRow(r: number): string {
    switch (this.rotation) {
      case 0:
        if (this.flip) return this.rowReverse(r);
        else return this.row(r);
      case 1:
        if (this.flip) return this.columnReverse(this.columns - 1 - r);
        else return this.column(this.columns - 1 - r);
      case 2:
        if (this.flip) return this.row(this.rows - 1 - r);
        else return this.rowReverse(this.rows - 1 - r);
      case 3:
        if (this.flip) return this.column(r);
        else return this.columnReverse(r);
    }
    return "";
  }
  top(r: number, f: boolean): string {
    switch (r) {
      case 0:
        if (f) return this.rowReverse(0);
        else return this.row(0);
      case 1:
        if (f) return this.columnReverse(-1);
        else return this.column(-1);
      case 2:
        if (f) return this.row(-1);
        else return this.rowReverse(-1);
      case 3:
        if (f) return this.column(0);
        else return this.columnReverse(0);
    }
    return "";
  }
  bottom(r: number, f: boolean): string {
    switch (r) {
      case 0:
        if (f) return this.rowReverse(-1);
        else return this.row(-1);
      case 1:
        if (f) return this.columnReverse(0);
        else return this.column(0);
      case 2:
        if (f) return this.row(0);
        else return this.rowReverse(0);
      case 3:
        if (f) return this.column(-1);
        else return this.columnReverse(-1);
    }
    return "";
  }
  left(r: number, f: boolean): string {
    switch (r) {
      case 0:
        if (f) return this.column(-1);
        else return this.column(0);
      case 1:
        if (f) return this.rowReverse(-1);
        else return this.rowReverse(0);
      case 2:
        if (f) return this.columnReverse(0);
        else return this.columnReverse(-1);
      case 3:
        if (f) return this.row(0);
        else return this.row(-1);
    }
    return "";
  }
  right(r: number, f: boolean): string {
    switch (r) {
      case 0:
        if (f) return this.column(0);
        else return this.column(-1);
      case 1:
        if (f) return this.rowReverse(0);
        else return this.rowReverse(-1);
      case 2:
        if (f) return this.columnReverse(-1);
        else return this.columnReverse(0);
      case 3:
        if (f) return this.row(-1);
        else return this.row(0);
    }
    return "";
  }
  toString(): string {
    let out = this.name + "\n";
    out += "top: " + `${this.topNeighbor ? this.topNeighbor.name : ""} ${this.topNeighbor ? this.topNeighbor.rotation : ""}, ${this.topNeighbor ? this.topNeighbor.flip : ""}\n`;
    out += "bottom: " + `${this.bottomNeighbor ? this.bottomNeighbor.name : ""} ${this.bottomNeighbor ? this.bottomNeighbor.rotation : ""}, ${this.bottomNeighbor ? this.bottomNeighbor.flip : ""}\n`;
    out += "left: " + `${this.leftNeighbor ? this.leftNeighbor.name : ""} ${this.leftNeighbor ? this.leftNeighbor.rotation : ""}, ${this.leftNeighbor ? this.leftNeighbor.flip : ""}\n`;
    out += "right: " + `${this.rightNeighbor ? this.rightNeighbor.name : ""} ${this.rightNeighbor ? this.rightNeighbor.rotation : ""}, ${this.rightNeighbor ? this.rightNeighbor.flip : ""}\n`;
    for (let i = 0; i < this.rows; i++) {
      out += this.rotatedRow(i) + "\n";
    }
    return out;
  }
}

function matchTiles(tiles_: { [key: string]: Tile }) {
  const tiles = Object.values(tiles_);
  for (let i = 0; i < tiles.length; i++) {
    const thisTile = tiles[i];
    for (let j = 0; j < tiles.length; j++) {
      if (i == j) continue;
      const testTile = tiles[j];
      for (let r = 0; r < 4; r++) {
        if (thisTile.top(0, false) == testTile.bottom(r, false)) {
          thisTile.topNeighbor = { name: testTile.name, rotation: r, flip: false };
        }
        if (thisTile.top(0, false) == testTile.bottom(r, true)) {
          thisTile.topNeighbor = { name: testTile.name, rotation: r, flip: true };
        }
        if (thisTile.bottom(0, false) == testTile.top(r, false)) {
          thisTile.bottomNeighbor = { name: testTile.name, rotation: r, flip: false };
        }
        if (thisTile.bottom(0, false) == testTile.top(r, true)) {
          thisTile.bottomNeighbor = { name: testTile.name, rotation: r, flip: true };
        }
        if (thisTile.left(0, false) == testTile.right(r, false)) {
          thisTile.leftNeighbor = { name: testTile.name, rotation: r, flip: false };
        }
        if (thisTile.left(0, false) == testTile.right(r, true)) {
          thisTile.leftNeighbor = { name: testTile.name, rotation: r, flip: true };
        }
        if (thisTile.right(0, false) == testTile.left(r, false)) {
          thisTile.rightNeighbor = { name: testTile.name, rotation: r, flip: false };
        }
        if (thisTile.right(0, false) == testTile.left(r, true)) {
          thisTile.rightNeighbor = { name: testTile.name, rotation: r, flip: true };
        }
      }
    }
  }
}

function placeTiles(tiles: { [key: string]: Tile }, dimensions: number, places: Array<Array<Tile | null>>): Array<Array<Tile | null>> {
  const corners = Object.values(tiles).filter(t => {
    let count = 0;
    if (t.topNeighbor != null) {
      count += 1;
    }
    if (t.bottomNeighbor != null) {
      count += 1;
    }
    if (t.leftNeighbor != null) {
      count += 1;
    }
    if (t.rightNeighbor != null) {
      count += 1;
    }
    return (count == 2);
  });

  // find and rotate first corner
  const first = corners[0];
  if (first.topNeighbor != null) {
    if (first.leftNeighbor != null) {
      first.rotation = 2;
    }
    else {
      first.rotation = 3;
    }
  }
  else if (first.leftNeighbor != null) {
    first.rotation = 1;
  }

  places[0][0] = first;


  for (let i = 0; i < dimensions - 1; i++) {
    for (let j = 0; j < dimensions; j++) {
      if (places[i][j] != null) {
        if (i != dimensions - 1) {
          const pos = places[i][j].getNeighbor("bottom");
          if (pos != null) {
            if (places[i + 1][j] == null) {
              if (!tiles[pos.name].placed) {
                tiles[pos.name].rotation = pos.rotation;
                tiles[pos.name].flip = pos.flip;
                tiles[pos.name].placed = true;
                places[i + 1][j] = tiles[pos.name];
              }
            }
            else if (places[i + 1][j].name != pos.name) {
              console.log(i + 1, j, "missmatch", places[i + 1][j].name, pos.name);
            }
          } else {
            console.log(i + 1, j, "bottom missing from", i, j, places[i][j].name);
          }

        }
        if (j != dimensions - 1) {
          if (places[i][j + 1] == null) {
            const pos = places[i][j].getNeighbor("right");
            if (pos != null) {
              if (places[i][j + 1] == null) {
                if (!tiles[pos.name].placed) {
                  tiles[pos.name].rotation = pos.rotation;
                  tiles[pos.name].flip = pos.flip;
                  tiles[pos.name].placed = true;
                  places[i][j + 1] = tiles[pos.name];
                }
              }
              else if (places[i][j + 1].name != pos.name) {
                console.log(i, j + 1, "missmatch", places[i + 1][j].name, pos.name);
              }
            } else {
              console.log(i, j + 1, "right missing from", i, j, places[i][j].name);
            }
          }
        }
      }
    }
  }
  return places;
}

fs.readFile('input.txt', 'utf8', function(err: Error, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const tiles: { [key: string]: Tile } = {};
  contents.trim().split("\n\n").forEach(
    (x: string) => {
      const t = new Tile(x);
      tiles[t.name] = t;
    }
  );
  matchTiles(tiles);
  // console.log("tiles :");
  // Object.values(tiles).forEach(x => {
  //   console.log(x.toString(-1));
  // });

  const dimension = Math.sqrt(Object.values(tiles).length);
  let places: Array<Array<Tile | null>> = Array.from({ length: dimension }, () => Array.from({ length: dimension }, () => null));


  places = placeTiles(tiles, dimension, places);
  let out = "";
  for (let i = 0; i < dimension; i++) {
    for (let j = 0; j < dimension; j++) {
      if (places[i][j] != null) {
        out += `${places[i][j].name.substr(5)}(${places[i][j].rotation},${places[i][j].flip ? "F" : " "}) `;
      }
      else {
        out += "_________" + " ";

      }
    }
    out += "\n";
  }
  console.log(out);

  out = "";
  for (let i = 0; i < dimension; i++) {
    for (let k = 0; k < places[0][0].rows; k++) {
      for (let j = 0; j < dimension; j++) {
        if (places[i][j]) {
          const r = places[i][j].rotatedRow(k);
          out += r + " ";
        }
        else {
          out += "__________" + " ";
        }
      }
      out += "\n";
    }
    out += "\n";
  }
  console.log(out);

  console.log("Without border");
  let map = "Tile 0:\n";
  for (let i = 0; i < dimension; i++) {
    for (let k = 1; k < places[0][0].rows - 1; k++) {
      for (let j = 0; j < dimension; j++) {
        const r = places[i][j].rotatedRow(k);
        map += r.substr(1, r.length - 2);
      }
      map += "\n";
    }
  }
  console.log(map);
  const m = new Tile(map);
  const monsterLength = 20;
  const regexp1 = /..................#./;
  const regexp2 = /#....##....##....###/;
  const regexp3 = /.#..#..#..#..#..#.../;

  // for (let r = 0; r < 4; r++) {
  // for (let f = 0; f < 2; f++) {
  // m.rotation = r;
  // m.flip = f == 0 ? false : true;
  const r = 2;
  const f = 1;
  m.rotation = 2;
  m.flip = true;
  let waters = 0;
  let count = 0;
  for (let i = 0; i < m.rows; i++) {
    let row = m.rotatedRow(i);
    waters += (row.match(/#/g) || []).length;
    if (i == 0 || i == m.rows - 1) continue;
    let index = 0;
    let pos = 0;
    const done = false;
    while (!done) {
      index = row.search(regexp2);
      if (index == -1) break;

      pos += index;
      const hRow = m.rotatedRow(i - 1).substring(pos, pos + monsterLength);
      const bRow = m.rotatedRow(i + 1).substring(pos, pos + monsterLength);
      console.log(r, f, i, `Found middle ${pos}`);
      console.log("h", hRow);
      console.log("m", row.substring(index, index + monsterLength));
      console.log("b", bRow);
      if (bRow.search(regexp3) == 0) {
        console.log(`Found bottom`);
        if (hRow.search(regexp1) == 0) {
          console.log(`Found head`);
          count++;
        }
      }
      row = row.substr(index + 1);
      pos += 1;
    }
  }
  if (count > 0) {
    console.log(r, f, "count:", count, count * 15);
    console.log(r, f, "waters:", waters, waters - count * 15);
  }
  //   }
  // }
  // m.rotation = 2;
  // m.flip = true;
  // console.log(m.toString());




});
