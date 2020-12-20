import fs from 'fs';

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const map: Array<Array<boolean>> = contents.trim().split("\n").map(
    (x: string): Array<boolean> => {
      return x.trim().split("").map((v: string): boolean => {
        return v == "#";
      });
    }
  );
  const pos = { x: 0, y: 0 };
  const size = { x: map[0].length, y: map.length };
  let count = 0;
  while (pos.y < size.y) {
    if (map[pos.y][pos.x]) {
      count++;
    }
    pos.x = (pos.x + 3) % size.x;
    pos.y++;
  }

  console.log("Trees", count);
});
