import fs from 'fs';

interface matchRes {
  matched: boolean,
  remainder: Array<string>,
}
class Rule {
  text: string
  constructor(text: string) {
    this.text = text;
  }
  match(s: string): matchRes {
    console.log(`unknown ${this.text}`);
    return { matched: false, remainder: [] };
  }
}

class OrRule extends Rule {
  pattern: Array<Rule>;
  constructor(pattern: Array<Rule>, text: string) {
    super(text);
    this.pattern = pattern;
  }
  match(s: string): matchRes {
    // console.log(`or "${this.text}" of ${s}`);
    let remainingLetters: Array<string> = [];
    for (let t = 0; t < this.pattern.length; t++) {
      const test = this.pattern[t];
      const { matched, remainder } = test.match(s);
      // console.log(`   "${test.text}" of ${s} = ${remainder} (${matched})`);
      if (matched) {
        remainingLetters = remainingLetters.concat(remainder);
      }
    }
    if (remainingLetters.length) {
      return { matched: true, remainder: remainingLetters };
    }
    return { matched: false, remainder: [] };
  }
}

class AndRule extends Rule {
  pattern: Array<Rule>;
  text: string
  constructor(pattern: Array<Rule>, text: string) {
    super(text);
    this.pattern = pattern;
  }
  match(s: string): matchRes {
    // console.log(`and "${this.text}" of ${s}`);
    let testStrings: Array<string> = [s];
    let remainingLetters: Array<string> = [];
    for (let t = 0; t < this.pattern.length; t++) {
      const test = this.pattern[t];
      remainingLetters = [];
      for (let i = 0; i < testStrings.length; i++) {
        const { matched, remainder } = test.match(testStrings[i]);
        // console.log(`   "${test.text}" of ${testStrings[i]} = ${remainder} (${matched})`);
        if (matched) {
          remainingLetters = remainingLetters.concat(remainder);
        }
      }
      testStrings = remainingLetters;
    }
    if (remainingLetters.length) {
      return { matched: true, remainder: remainingLetters };
    }
    return { matched: false, remainder: [] };
  }
}

class LetterRule extends Rule {
  letter: string;
  constructor(l: string, text: string) {
    super(text);
    this.letter = l;
  }
  match(s: string): matchRes {
    // console.log("letter", this.letter, s, s.startsWith(this.letter));
    if (s.startsWith(this.letter)) {
      return { matched: true, remainder: [s.substring(1)] };
    }
    return { matched: false, remainder: [] };
  }
}

const builder = function(ruleNumber: number, textRules: { [key: number]: string }, existingRules: { [key: string]: Rule }): Rule {
  const r = textRules[ruleNumber].trim();
  if (r in existingRules) {
    return existingRules[r];
  }
  if (r.includes('"')) {
    const rule = new LetterRule(r[1], r);
    existingRules[r] = rule;
    return rule;
  }
  else if (r.includes('|')) {
    let recursiveRule: OrRule;
    const pattern: Array<Rule> = r.split("|").map((segment_: string) => {
      const segment = segment_.trim();
      if (segment in existingRules) {
        return existingRules[segment];
      }
      const segmentPattern: Array<Rule> = segment.split(" ").map((child: string): Rule => {
        const childNumber = parseInt(child);
        // If the rule refers to itself, add a dummy in to prevent looping.
        // We'll replace the pattern later
        if (childNumber === ruleNumber) {
          recursiveRule = new OrRule([], child);
          return recursiveRule;
        }
        return builder(childNumber, textRules, existingRules);
      });
      const rule = new AndRule(segmentPattern, segment);
      existingRules[segment] = rule;
      return rule;
    });
    const rule = new OrRule(pattern, r);
    if (recursiveRule != undefined) {
      // If this is a recursive rule, we need the pattern to refer to itself
      // Recursive rules are always in OR rules
      recursiveRule.pattern = rule.pattern;
    }
    existingRules[r] = rule;
    return rule;
  }
  else {
    const pattern: Array<Rule> = r.trim().split(" ").map((child: string): Rule => {
      return builder(parseInt(child), textRules, existingRules);
    });
    const rule = new AndRule(pattern, r);
    existingRules[r] = rule;
    return rule;
  }
};

fs.readFile('input.txt', 'utf8', function(err: Error, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const input = contents.trim().split("\n\n");
  const textRules: { [key: number]: string } = {};
  input[0].trim().split("\n").forEach(
    (x: string) => {
      const res = x.trim().split(":");
      const num = parseInt(res[0]);
      textRules[num] = res[1];
    }
  );
  textRules[8] = "42 | 42 8";
  textRules[11] = "42 31 | 42 11 31";

  const ruleZero = builder(0, textRules, {});
  const messages = input[1].trim().split("\n");

  let count = 0;
  messages.forEach(
    (x: string) => {
      const { matched, remainder } = ruleZero.match(x);
      const done = remainder.filter((y: string) => y.length == 0);
      // console.log("Done", x, matched, remainder, done);
      if (matched && done.length > 0) {
        count++;
      }

    });
  console.log("Count = ", count);
});
