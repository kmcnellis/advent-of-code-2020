var fs = require('fs');

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

const validate = (key: string, value: string): boolean => {
  try {
    switch (key) {
      case "byr":
        {
          const v = parseInt(value)
          return (v >= 1920 && v <= 2002)
        }
      case "iyr":
        {
          const v = parseInt(value)
          return (v >= 2010 && v <= 2020)
        }
      case "eyr":
        {
          const v = parseInt(value)
          return (v >= 2020 && v <= 2030)
        }
      case "hgt":
        {
          const v = parseInt(value.substring(0, value.length - 2))

          if (value.endsWith("cm")) {
            return (v >= 150 && v <= 193)
          } else if (value.endsWith("in")) {
            return (v >= 59 && v <= 76)
          }
          return false
        }
      case "hcl":
        {
          const regex = new RegExp("^#[A-Fa-f0-9]{6}$")
          return regex.test(value)
        }
      case "ecl":
        {
          const regex = new RegExp("^(amb|blu|brn|gry|grn|hzl|oth)$")
          return regex.test(value)
        }
      case "pid":
        {
          if (value.length != 9) {
            return false
          }
          parseInt(value)
          return true
        }
      case "cid":
        {
          return true
        }
      default:
        return false

    }
  }
  catch (err) {
    console.log("err:", err)
    return false
  }
}

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const passports: Array<{ [key: string]: string }> = contents.trim().split("\n\n").map(
    (x: string): { [key: string]: string } => {
      let pp: { [key: string]: string } = {};
      x.trim().split(/\s/g).forEach(
        (y: string) => {
          const vals = y.trim().split(":")
          pp[vals[0]] = vals[1]
        });
      return pp;
    }
  );

  let count = 0
  passports.forEach((pp: { [key: string]: string }) => {
    const k = Object.keys(pp)
    const fields = new Set(Object.keys(pp));
    if (fields.size != k.length) {
      return;
    }

    let valid = true;
    fields.forEach((x: string) => {
      if (!validate(x, pp[x])) {
        valid = false
      }
    })
    expected.forEach((x: string) => {
      if (!(fields.has(x))) {
        valid = false
      }
    })
    if (valid) {
      count += 1
    }
  })
  console.log("Count:", count)
});
