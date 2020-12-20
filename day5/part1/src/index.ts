import fs from 'fs';

interface Seat { code: string; id: number }

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const seats: Array<Seat> = contents.trim().split("\n").map(
    (x: string): Seat => {
      const id = x.trim().split("").map((y: string): string => {
        switch (y) {
          case "F":
          case "L":
            return "0";
          case "B":
          case "R":
            return "1";
        }
        return " ";
      }).join("");

      return {
        code: x,
        id: parseInt(id, 2),
      };
    }
  );

  console.log(seats);
  let max = 0;
  seats.forEach((s: Seat) => {
    max = Math.max(max, s.id);
  });
  console.log("Max:", max);
});

