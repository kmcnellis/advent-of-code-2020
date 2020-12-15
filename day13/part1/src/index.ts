var fs = require('fs');
import { mod } from 'mathjs';

fs.readFile('input.txt', 'utf8', async function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const input = contents.trim().split("\n")
  const routes = input[1].split(",").map(
    (x: string): number => {
      if (x == "x") {
        return 0
      }
      return parseInt(x)
    }).filter((x: number) => x !== 0);
  const arrival = parseInt(input[0])
  console.log("arrival", arrival)
  console.log("routes", routes)

  let min = Infinity
  let best = 0
  for (let i = 0; i < routes.length; i++) {
    let delay = routes[i] - mod(arrival, routes[i])
    console.log(`delay for ${routes[i]} = ${delay}`)
    if (delay < min) {
      min = delay
      best = routes[i]
    }
  }
  console.log(`min delay is ${min} with route ${best} = ${min * best}`)
});

