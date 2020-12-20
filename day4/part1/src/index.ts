import fs from 'fs';

const expected = new Set([
  "byr",// (Birth Year)
  "iyr",// (Issue Year)
  "eyr",// (Expiration Year)
  "hgt",// (Height)
  "hcl",// (Hair Color)
  "ecl",// (Eye Color)
  "pid",// (Passport ID)
]);

const optional = new Set([
  "cid",// (Country ID)
]);

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const passports: Array<{ [key: string]: string }> = contents.trim().split("\n\n").map(
    (x: string): { [key: string]: string } => {
      const pp: { [key: string]: string } = {};
      x.trim().split(/\s/g).forEach(
        (y: string) => {
          const vals = y.trim().split(":");
          pp[vals[0]] = vals[1];
        });
      return pp;
    }
  );

  let count = 0;
  passports.forEach((pp: { [key: string]: string }) => {
    const k = Object.keys(pp);
    const fields = new Set(Object.keys(pp));
    if (fields.size != k.length) {
      console.log("duplicate field");
      return;
    }

    let valid = true;
    fields.forEach((x: string) => {
      if (!(expected.has(x) || optional.has(x))) {
        valid = false;
      }
    });
    expected.forEach((x: string) => {
      if (!(fields.has(x))) {
        valid = false;
      }
    });
    if (valid) {
      count += 1;
    }
  });
  console.log("Count:", count);
});
