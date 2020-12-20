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

  seats.sort(compare);
  let last = seats[0].id - 1;
  seats.forEach((s: Seat) => {
    if (s.id - last != 1) {
      console.log("Missing seat is:", s.id - 1);
    }
    last = s.id;
  });


});


const compare = (a: Seat, b: Seat): number => a.id - b.id;
