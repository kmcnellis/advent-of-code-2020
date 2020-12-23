import fs from 'fs';


const hashGame = (player1: Array<number>, player2: Array<number>) =>
  player1.map(x => `${x}`).join(":") + "|" + player2.map(x => `${x}`).join(":");

// @returns {boolean} Did player1 win?
const playGame = function(player1: Array<number>, player2: Array<number>, game: number): boolean {
  const roundHistory: { [key: string]: boolean } = {};
  let round = 0;
  while (player1.length && player2.length) {
    if (round > 3000) break;
    round++;
    // if there was a previous round in this game that had exactly the same cards in the same order in the same players' decks, the game instantly ends in a win for player 1
    const h = hashGame(player1, player2);
    if (h in roundHistory) {
      // console.log(`g ${game} r ${round}, ${h} p1 wins by default`);
      return true;
    }
    roundHistory[h] = true;

    // Otherwise, this round's cards must be in a new configuration; the players begin the round by each drawing the top card of their deck as normal.
    const c1 = player1.shift();
    const c2 = player2.shift();
    // console.log(`g ${game} r ${round}, p1=${c1}, p2=${c2}`);

    // if at least one player does not have enough cards left in their deck to recurse; the winner of the round is the player with the higher-value card.
    if (player1.length < c1 || player2.length < c2) {
      if (c1 > c2) {
        player1.push(c1);
        player1.push(c2);
        // console.log("   p1 wins");
      } else {
        player2.push(c2);
        player2.push(c1);
        // console.log("   p2 wins");
      }
    }
    // If both players have at least as many cards remaining in their deck as the value of the card they just drew, the winner of the round is determined by playing a new game of Recursive Combat (see below).
    else {
      const newP1 = player1.slice(0, c1);
      const newP2 = player2.slice(0, c2);
      // console.log("Playing a sub-game to determine the winner...");
      if (playGame(newP1, newP2, game + 1)) {
        // p1 won
        player1.push(c1);
        player1.push(c2);
        // console.log("   p1 wins");
      }
      else {
        // p2 won
        player2.push(c2);
        player2.push(c1);
        // console.log("   p2 wins");
      }
    }
  }
  // console.log(`game ${game} ${player1.length > 0 ? "p1 wins" : "p2 wins"}`);
  if (game == 1) {
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
  }
  return (player1.length > 0);
};

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

  const p1won = playGame(player1, player2, 1);
  console.log(`${p1won ? "OVERALL p1 wins" : "p2 wins"}`);

});

const compare = (a: number, b: number): number => a - b;
