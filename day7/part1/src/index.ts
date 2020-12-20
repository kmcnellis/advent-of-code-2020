import fs from 'fs';

interface Bag {
  color: string;
  contents: Children[];
}
interface Children {
  color: string;
  number: number;
}

const bagRegex = new RegExp(/^(\w* \w*) bags contain (.*)\.$/m);
const contentsRegex = new RegExp(/^(\d*) (\w* \w*) bags?,? ?(.*)$/m);

const parseBag = (bag: string): Array<Children> => {
  const res = bag.match(contentsRegex);
  if (res == null) {
    return [];
  }
  const item = {
    color: res[2],
    number: parseInt(res[1])
  };
  const content = parseBag(res[3]);
  content.push(item);
  return content;
};

const getContainers = (color: string, bags: Array<Bag>): Array<Bag> => {
  const valid = bags.filter((b) => {
    return (b.contents.filter((c) => c.color == color).length > 0);
  });
  let result = valid;
  valid.forEach((b) => {
    const children = getContainers(b.color, bags);
    result = result.concat(children);
  });
  return result;
};

fs.readFile('input.txt', 'utf8', function(err: any, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const bags: Array<Bag> = contents.trim().split("\n").map(
    (x: string): Bag => {
      const res = x.match(bagRegex);
      if (res == null) {
        console.log("error parsing", x);
        return null;
      }
      const color = res[1];
      const remainder = res[2];
      if (remainder == "no other bags") {
        return {
          color: color,
          contents: []
        };
      }
      const contents = parseBag(remainder);
      return {
        color: color,
        contents: contents
      };
    }
  );
  const containers = getContainers("shiny gold", bags);
  containers.forEach(b => console.log(b.color, b.contents));

  const result = new Set();
  containers.forEach(b => result.add(b.color));

  console.log("Valid outers = ", result.size);
});
