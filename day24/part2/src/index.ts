import fs from 'fs';
import * as math from 'mathjs';

class Tile {
  label: string;
  flipped: boolean;
  lastFlipped: boolean;
  _east: Tile;
  _southeast: Tile;
  _southwest: Tile;
  _west: Tile;
  _northwest: Tile;
  _northeast: Tile;
  constructor(label: string) {
    this.label = label;
    this.flipped = false;
    this.lastFlipped = false;
    this._east = null;
    this._southeast = null;
    this._southwest = null;
    this._west = null;
    this._northwest = null;
    this._northeast = null;
  }
  flip() {
    this.flipped = !this.flipped;
  }
  east() {
    if (this._east == null) {
      this._east = new Tile(this.label + " e");
    }
    return this._east;
  }
  setEast(t: Tile) {
    this._east = t;
  }
  getEast() {
    return this._east;
  }
  southeast() {
    if (this._southeast == null) {
      generateTiles(this);
    }
    return this._southeast;
  }
  setSoutheast(t: Tile) {
    this._southeast = t;
  }
  getSoutheast() {
    return this._southeast;
  }
  southwest() {
    if (this._southwest == null) {
      generateTiles(this);
    }
    return this._southwest;
  }
  setSouthwest(t: Tile) {
    this._southwest = t;
  }
  getSouthwest() {
    return this._southwest;
  }
  west() {
    if (this._west == null) {
      generateTiles(this);
    }
    return this._west;
  }
  setWest(t: Tile) {
    this._west = t;
  }
  getWest() {
    return this._west;
  }
  northwest() {
    if (this._northwest == null) {
      generateTiles(this);
    }
    return this._northwest;
  }
  setNorthwest(t: Tile) {
    this._northwest = t;
  }
  getNorthwest() {
    return this._northwest;
  }
  northeast() {
    if (this._northeast == null) {
      generateTiles(this);
    }
    return this._northeast;
  }
  setNortheast(t: Tile) {
    this._northeast = t;
  }
  getNortheast() {
    return this._northeast;
  }
  getNeighbors(): Array<Tile> {
    return [
      this._east,
      this._southeast,
      this._southwest,
      this._west,
      this._northwest,
      this._northeast
    ].filter(x => x != null);
  }
  countNeighbor(): number {
    return this.getNeighbors().map(t => t.lastFlipped).reduce(
      (c: number, f: boolean) => { return c + (f ? 1 : 0); }, 0);
  }
  evolve() {
    const n = this.countNeighbor();
    if (n == 0 || n > 2) {
      this.flipped = false;
    }
    if (n == 2) {
      this.flipped = true;
    }
  }

  toString() {
    return `${this.label}` + "\n" +
      `color: ${this.flipped ? "black" : "while"}` + "\n" +
      `east: ${this._east ? this._east.label : "null"}` + "\n" +
      `southeast: ${this._southeast ? this._southeast.label : "null"}` + "\n" +
      `southwest: ${this._southwest ? this._southwest.label : "null"}` + "\n" +
      `west: ${this._west ? this._west.label : "null"}` + "\n" +
      `northwest: ${this._northwest ? this._northwest.label : "null"}` + "\n" +
      `northeast: ${this._northeast ? this._northeast.label : "null"}` + "\n" + "\n";
  }
}

const tiles: Array<Tile> = [];

const generateTiles = function(origin: Tile) {
  if (origin.getEast() == null) {
    const east = new Tile(origin.label + " e");
    origin.setEast(east);
    tiles.push(east);
  }

  if (origin.getSoutheast() == null) {
    const southeast = new Tile(origin.label + " se");
    origin.setSoutheast(southeast);
    tiles.push(southeast);
  }

  if (origin.getSouthwest() == null) {
    const southwest = new Tile(origin.label + " sw");
    origin.setSouthwest(southwest);
    tiles.push(southwest);
  }

  if (origin.getWest() == null) {
    const west = new Tile(origin.label + " w");
    origin.setWest(west);
    tiles.push(west);
  }

  if (origin.getNorthwest() == null) {
    const northwest = new Tile(origin.label + " nw");
    origin.setNorthwest(northwest);
    tiles.push(northwest);
  }

  if (origin.getNortheast() == null) {
    const northeast = new Tile(origin.label + " ne");
    origin.setNortheast(northeast);
    tiles.push(northeast);
  }


  origin.east().setNorthwest(origin.northeast());
  origin.east().setSouthwest(origin.southeast());
  origin.east().setWest(origin);

  origin.northeast().setWest(origin.northwest());
  origin.northeast().setSoutheast(origin.east());
  origin.northeast().setSouthwest(origin);

  origin.northwest().setEast(origin.northeast());
  origin.northwest().setSouthwest(origin.west());
  origin.northwest().setSoutheast(origin);

  origin.west().setNortheast(origin.northwest());
  origin.west().setSoutheast(origin.southwest());
  origin.west().setEast(origin);

  origin.southwest().setEast(origin.southeast());
  origin.southwest().setNorthwest(origin.west());
  origin.southwest().setNortheast(origin);

  origin.southeast().setWest(origin.southwest());
  origin.southeast().setNortheast(origin.east());
  origin.southeast().setNorthwest(origin);
};

const flipTile = function(origin: Tile, direction: string, currDist: number) {
  let done = false;
  let next = "";
  let i = 0;
  let currentTile = origin;
  let dist = 0;
  while (!done) {
    dist++;
    if (dist > currDist) {
      tiles.forEach((t: Tile) => { generateTiles(t); });
    }
    next = direction[i];
    i++;
    switch (next) {
      case "s":
        next += direction[i];
        i++;
        break;
      case "n":
        next += direction[i];
        i++;
        break;
    }
    switch (next) {
      case "e":
        currentTile = currentTile.east();
        break;
      case "se":
        currentTile = currentTile.southeast();
        break;
      case "sw":
        currentTile = currentTile.southwest();
        break;
      case "w":
        currentTile = currentTile.west();
        break;
      case "nw":
        currentTile = currentTile.northwest();
        break;
      case "ne":
        currentTile = currentTile.northeast();
        break;
    }
    if (i == direction.length) {
      done = true;
      break;
    }
  }

  currentTile.flip();
  return dist;
};

fs.readFile('input.txt', 'utf8', function(err: Error, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }

  const directions = contents.trim().split("\n").map((x: string) => {
    return x;
  });


  const origin = new Tile("o");
  tiles.push(origin);
  generateTiles(origin);

  let currDist = 1;
  directions.forEach((d: string) => {
    currDist = flipTile(origin, d, currDist);
  });

  let count = 0;
  tiles.forEach((t: Tile) => {
    if (t.flipped) {
      count++;
    }
  });

  for (let days = 0; days < 100; days++) {
    tiles.forEach((t: Tile) => {
      t.lastFlipped = t.flipped;
    });

    tiles.forEach((t: Tile) => {
      t.lastFlipped = t.flipped;
    });

    tiles.forEach((t: Tile) => {
      t.evolve();
    });

    let count = 0;
    tiles.forEach((t: Tile) => {
      if (t.flipped) {
        count++;
      }
    });

    console.log("days", days, "count", count);

  }
});

const compare = (a: number, b: number): number => a - b;

//  nw ne
// w  o  e
//  sw se