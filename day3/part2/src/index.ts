var fs = require('fs');

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  let map: Array<Array<boolean>> = contents.trim().split("\n").map(
    (x: string): Array<boolean> => {
      return x.trim().split("").map((v: string): boolean => {
        return v == "#"
      })
    }
  );
  let c = 1
  c *= countTrees(map, 1, 1);
  c *= countTrees(map, 3, 1);
  c *= countTrees(map, 5, 1);
  c *= countTrees(map, 7, 1);
  c *= countTrees(map, 1, 2);

  console.log(`Totals = ${c}`)

});


const countTrees = (map: Array<Array<boolean>>, sx: number, sy: number) => {
  let pos = { x: 0, y: 0 }
  let size = { x: map[0].length, y: map.length }
  let slope = { x: sx, y: sy }
  let count = 0
  while (pos.y < size.y) {
    if (map[pos.y][pos.x]) {
      count++
    }
    pos.x = (pos.x + slope.x) % size.x
    pos.y += slope.y
  }

  console.log(`Slope x: ${sx}, y: ${sy}, Trees: ${count}`)
  return count
}