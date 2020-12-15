var fs = require('fs');

fs.readFile('input.txt', 'utf8', async function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const input = contents.trim().split("\n")
  const routes = input[1].split(",").map(
    (x: string): bigint => {
      if (x == "x") {
        return BigInt(1)
      }
      return BigInt(parseInt(x))
    })
  // .filter((x: number) => x !== 1);
  console.log("routes", routes)

  let mult = BigInt(1)
  let result = BigInt(0)
  for (let i = 0; i < routes.length; i++) {
    mult *= routes[i]
  }
  for (let i = 0; i < routes.length; i++) {
    let a = routes[i]
    if (a == BigInt(1)) {
      continue
    }
    let factor = (mult / a)
    let inverse = modInverse(factor, a)
    console.log(`modInverse ${factor} % ${a} = ${inverse}`)
    result += BigInt(factor * inverse * BigInt(i) * BigInt(-1))
  }
  result = bigMod(result, BigInt(mult))
  // Verify we didn't have an overflow issue
  for (let i = 0; i < routes.length; i++) {
    let a = BigInt(routes[i])
    if (a == BigInt(1)) {
      continue
    }
    let r = result + BigInt(i)
    console.log(`${i}:${r} % ${a} = ${bigMod(r, a)}`)
  }
  console.log(`result ${result}`)
});

// Function to find modular inverse of a under modulo m
// Assumption: m is prime
const modInverse = (a: bigint, m: bigint): bigint => {
  let g = gcd(a, m);
  if (g != BigInt(1)) {
    console.log(a, m, "Inverse doesn't exist")
    return BigInt(0)
  }
  else {
    // If a and m are relatively prime, then modulo
    // inverse is a^(m-2) mode m
    return power(a, m - BigInt(2), m);
  }
}

// Mod power function
const power = (x: bigint, y: bigint, m: bigint): bigint => {
  if (y == BigInt(0))
    return BigInt(1);
  let p = bigMod(power(x, (y / BigInt(2)), m), m);
  p = bigMod((p * p), m);

  return (bigMod(y, BigInt(2)) == BigInt(0)) ? p : bigMod((x * p), m);
}

// Modulus (with positive result)
const bigMod = function(a: bigint, n: bigint): bigint {
  return ((a % n) + n) % n;
};

// GCD for bigints
const gcd = function(x: bigint, y: bigint) {
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}
