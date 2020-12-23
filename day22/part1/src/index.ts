import fs from 'fs';

fs.readFile('input.txt', 'utf8', function(err: Error, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }

  const cards = contents.trim().split("\n\n");
  const getCards = (c: string) => c.trim().split("\n").slice(1).map(
    (x: string) => {
      return parseInt(x);
    }
  );

  const player1: Array<number> = getCards(cards[0]);
  const player2: Array<number> = getCards(cards[1]);

  console.log("player1", player1);
  console.log("player2", player2);

  let round = 0;
  while (player1.length && player2.length) {
    if (round > 3000) break;
    round++;
    const c1 = player1.shift();
    const c2 = player2.shift();
    console.log(`r ${round}, p1=${c1}, p2=${c2}, ${c1 > c2 ? "p1 wins" : "p2 wins"}`);

    if (c1 > c2) {
      player1.push(c1);
      player1.push(c2);
    } else {
      player2.push(c2);
      player2.push(c1);
    }
  }

  console.log("DONE, rounds = ", round);
  console.log(`${player1.length ? "p1 wins" : "p2 wins"}`);
  console.log("player1", player1);
  console.log("player2", player2);

  const score = (cards: Array<number>) => cards.map(
    (x: number, index: number) => {
      return x * (cards.length - index);
    }
  ).reduce((c, s) => c + s);
  if (player1.length) {
    console.log("score = ", score(player1));
  }
  else {
    console.log("score = ", score(player2));
  }

});

const compare = (a: number, b: number): number => a - b;
