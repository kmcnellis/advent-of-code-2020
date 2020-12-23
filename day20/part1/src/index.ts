import fs from 'fs';

interface position {
  name: string
  rotation: number
}
class Tile {
  name: string
  contents: Array<Array<string>>
  rows: number
  columns: number
  rotation: number
  topNeighbors: Array<position>
  bottomNeighbors: Array<position>
  leftNeighbors: Array<position>
  rightNeighbors: Array<position>
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
  // rotation 4:
  // 210
  // 543
  // 876
  // rotation 5:
  // 036
  // 147
  // 258
  // rotation 6:
  // 678
  // 345
  // 012
  // rotation 7:
  // 852
  // 741
  // 630
  constructor(input: string) {
    const data = input.split("\n");
    this.name = data[0].trim();
    this.name = this.name.substring(0, this.name.length - 1);
    this.contents = [];
    this.topNeighbors = [];
    this.bottomNeighbors = [];
    this.leftNeighbors = [];
    this.rightNeighbors = [];
    this.rotation = 0;
    for (let i = 1; i < data.length; i++) {
      this.contents.push(data[i].trim().split(""));
    }
    this.rows = this.contents.length;
    this.columns = this.contents[0].length;
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
  top(r: number | null): string {
    if (r == -1) { r = this.rotation; }
    switch (r) {
      case 0:
        return this.row(0);
      case 1:
        return this.column(-1);
      case 2:
        return this.rowReverse(-1);
      case 3:
        return this.columnReverse(0);
      case 4:
        return this.rowReverse(0);
      case 5:
        return this.column(0);
      case 6:
        return this.row(-1);
      case 7:
        return this.columnReverse(-1);
    }
    return "";
  }
  bottom(r: number | null): string {
    if (r == -1) { r = this.rotation; }
    switch (r) {
      case 0:
        return this.row(-1);
      case 1:
        return this.column(0);
      case 2:
        return this.rowReverse(0);
      case 3:
        return this.columnReverse(-1);
      case 4:
        return this.rowReverse(-1);
      case 5:
        return this.column(-1);
      case 6:
        return this.row(0);
      case 7:
        return this.columnReverse(0);
    }
    return "";
  }
  left(r: number | null): string {
    if (r == -1) { r = this.rotation; }
    switch (r) {
      case 0:
        return this.column(0);
      case 1:
        return this.rowReverse(0);
      case 2:
        return this.columnReverse(-1);
      case 3:
        return this.row(-1);
      case 4:
        return this.column(-1);
      case 5:
        return this.row(0);
      case 6:
        return this.columnReverse(0);
      case 7:
        return this.rowReverse(-1);
    }
    return "";
  }
  right(r: number | null): string {
    if (r == -1) { r = this.rotation; }
    switch (r) {
      case 0:
        return this.column(-1);
      case 1:
        return this.rowReverse(-1);
      case 2:
        return this.columnReverse(0);
      case 3:
        return this.row(0);
      case 4:
        return this.column(0);
      case 5:
        return this.row(-1);
      case 6:
        return this.columnReverse(-1);
      case 7:
        return this.rowReverse(0);
    }
    return "";
  }
  toString(r: number | null): string {
    let out = this.name + "\n";
    out += "top: " + this.topNeighbors.map(x => `${x.name} ${x.rotation}`)
      .join(", ") + "\n";
    out += "bottom: " + this.bottomNeighbors.map(x => `${x.name} ${x.rotation}`)
      .join(", ") + "\n";
    out += "left: " + this.leftNeighbors.map(x => `${x.name} ${x.rotation}`)
      .join(", ") + "\n";
    out += "right: " + this.rightNeighbors.map(x => `${x.name} ${x.rotation}`)
      .join(", ") + "\n";
    if (r == -1) { r = this.rotation; }
    switch (r) {
      case 0:
        for (let i = 0; i < this.rows; i++) {
          out += this.row(i) + "\n";
        }
        return out;
      case 1:
        for (let i = this.columns; i >= 0; i--) {
          out += this.column(i) + "\n";
        }
        return out;
      case 2:
        for (let i = this.rows; i >= 0; i--) {
          out += this.rowReverse(i) + "\n";
        }
        return out;
      case 3:
        for (let i = 0; i < this.columns; i++) {
          out += this.columnReverse(i) + "\n";
        }
        return out;
      case 4:
        for (let i = 0; i < this.rows; i++) {
          out += this.rowReverse(i) + "\n";
        }
        return out;
      case 5:
        for (let i = 0; i < this.columns; i++) {
          out += this.column(i) + "\n";
        }
        return out;
      case 6:
        for (let i = this.rows; i >= 0; i--) {
          out += this.row(i) + "\n";
        }
        return out;
      case 7:
        for (let i = this.columns; i >= 0; i--) {
          out += this.columnReverse(i) + "\n";
        }
        return out;
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
      for (let r = 0; r < 8; r++) {
        // console.log(thisTile.name, testTile.name, r, "top");
        // console.log(thisTile.top(0));
        // console.log(testTile.bottom(r));
        // console.log("");
        if (thisTile.top(0) == testTile.bottom(r)) {
          thisTile.topNeighbors.push({ name: testTile.name, rotation: r });
        }
        // console.log(thisTile.name, testTile.name, r, "bottom");
        // console.log(thisTile.bottom(0));
        // console.log(testTile.top(r));
        // console.log("");
        if (thisTile.bottom(0) == testTile.top(r)) {
          thisTile.bottomNeighbors.push({ name: testTile.name, rotation: r });
        }
        // console.log(thisTile.name, testTile.name, r, "left");
        // console.log(thisTile.left(0));
        // console.log(testTile.right(r));
        // console.log("");
        if (thisTile.left(0) == testTile.right(r)) {
          thisTile.leftNeighbors.push({ name: testTile.name, rotation: r });
        }
        // console.log(thisTile.name, testTile.name, r, "right");
        // console.log(thisTile.right(0));
        // console.log(testTile.left(r));
        // console.log("");
        if (thisTile.right(0) == testTile.left(r)) {
          thisTile.rightNeighbors.push({ name: testTile.name, rotation: r });
        }
      }
    }
  }
}

function placeTiles(places: Array<Array<Tile | null>>, unused: Array<string>, tiles: { [key: string]: Tile }): Array<Array<Tile | null>> {

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
  console.log("tiles :");
  Object.values(tiles).forEach(x => {
    console.log(x.toString(-1));
  });

  const corners = Object.values(tiles).filter(t => {
    let count = 0;
    if (t.topNeighbors.length) {
      count += 1;
    }
    if (t.bottomNeighbors.length) {
      count += 1;
    }
    if (t.leftNeighbors.length) {
      count += 1;
    }
    if (t.rightNeighbors.length) {
      count += 1;
    }
    return (count == 2);
  });

  console.log("corners :");
  corners.forEach(x => {
    console.log(x.toString(-1));
  });

});
