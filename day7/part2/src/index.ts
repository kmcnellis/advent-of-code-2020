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

const getChildren = (color: string, bags: Array<Bag>): number => {

  let num = 1;
  const parent = bags.filter((b) => {
    return (b.color == color);
  })[0];

  parent.contents.forEach((b) => {
    const children = getChildren(b.color, bags);
    num += children * b.number;
  });
  return num;
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
  const number = getChildren("shiny gold", bags);
  console.log("Number bags = ", number - 1);
});
