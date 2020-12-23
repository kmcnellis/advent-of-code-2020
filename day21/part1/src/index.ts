import fs from 'fs';

class Ingredient {
  name: string;
  allergen: string;
  count: number;
  possibleAllergens: Set<string>
  constructor(name: string) {
    this.name = name;
    this.allergen = "";
    this.possibleAllergens = new Set();
    this.count = 1;
  }
  possibleAllergen(): boolean {
    return this.allergen !== "" || this.possibleAllergens.size > 0;
  }
}
class Allergen {
  name: string;
  ingredient: string;
  count: number;
  possibleIngredients: Set<string>
  constructor(name: string) {
    this.name = name;
    this.ingredient = "";
    this.possibleIngredients = new Set();
    this.count = 1;
  }
}


fs.readFile('input.txt', 'utf8', function(err: Error, contents: string) {
  if (err != null) {
    console.error("Error", err);
    return;
  }
  const rRegex = new RegExp(/^((?:\w* ?)*) \(contains ((?:\w*,? ?)*)\)?$/);

  const allergens: { [key: string]: Allergen } = {};
  const ingredients: { [key: string]: Ingredient } = {};
  const fields = contents.trim().split("\n").forEach(
    (x: string) => {
      const res = x.match(rRegex);
      if (res == null) {
        console.log(x, "issue with regex");
        return;
      }
      const ingNames = res[1].trim().split(" ");
      const ings = ingNames.map((ing) => {
        return new Ingredient(ing);
      });
      const algNames = res[2].trim().split(", ");
      const algs = algNames.map((alg) => {
        return new Allergen(alg);
      });

      ings.forEach(ing => {
        if (!(ing.name in ingredients)) {
          ingredients[ing.name] = ing;
        } else {
          ingredients[ing.name].count++;
        }
        algNames.forEach(alg => {
          ingredients[ing.name].possibleAllergens.add(alg);
        });
      });

      algs.forEach(alg => {
        if (!(alg.name in allergens)) {
          allergens[alg.name] = alg;
          allergens[alg.name].possibleIngredients = new Set([...ingNames]);
        } else {
          allergens[alg.name].count++;
          allergens[alg.name].possibleIngredients = new Set([...ingNames].filter(
            x => allergens[alg.name].possibleIngredients.has(x))
          );
        }
      });
      console.log("ings", ings);
      console.log("algs", algs);
    }
  );

  console.log("");
  console.log("Initial: ");
  console.log("allergens");
  Object.values(allergens).forEach(alg => {
    console.log(alg);
  });
  console.log("ingredients");
  Object.values(ingredients).forEach(ing => {
    console.log(ing);
  });

  let changed = true;
  while (changed) {
    changed = false;
    Object.values(allergens).forEach(alg => {
      if (alg.possibleIngredients.size == 1) {
        alg.ingredient = alg.possibleIngredients.values().next().value;
        alg.possibleIngredients.clear();
        changed = true;
        return;
      }
      alg.possibleIngredients.forEach((key) => {
        switch (ingredients[key].allergen) {
          case "":
            break;
          case alg.name:
            alg.ingredient = key;
            alg.possibleIngredients.clear();
            changed = true;
            break;
          default:
            alg.possibleIngredients.delete(key);
            changed = true;
        }
      });

    });
    Object.values(ingredients).forEach(ing => {
      if (ing.possibleAllergens.size > 0) {
        ing.possibleAllergens.forEach((key) => {
          switch (allergens[key].ingredient) {
            case "":
              break;
            case ing.name:
              ing.allergen = key;
              ing.possibleAllergens.clear();
              changed = true;
              break;
            default:
              ing.possibleAllergens.delete(key);
              changed = true;
          }
        });
      }
    });
  }

  console.log("");
  console.log("Final: ");
  console.log("allergens");
  Object.values(allergens).forEach(alg => {
    console.log(alg);
  });
  console.log("ingredients");
  Object.values(ingredients).forEach(ing => {
    console.log(ing);
  });

  const count = Object.values(ingredients).filter(x => !x.possibleAllergen()).map(x => x.count).reduce((c, s) => c + s);
  console.log("count", count);
});
