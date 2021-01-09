const mappings = require('./mappings');
const fs = require('fs');
const path = require('path');

module.exports = {
    load: function (callback) {
        console.log("Starting Load");
        onLoadCallback = callback;

        let itemPath = path.join(__dirname, '../../data/Item.csv');
        let recipePath = path.join(__dirname, '../../data/Recipe.csv');

        fs.readFile(itemPath, 'utf-8', handleItemLoad);
        fs.readFile(recipePath, 'utf-8', handleRecipeLoad);
    }
}

let recipes = [];
let items = [];
let itemsLoaded = false;
let recipesLoaded = false;
let onLoadCallback = undefined;

function handleItemLoad(err, data) {
    console.log("Parsing Items");

    if (err) {
        console.error(err);
    }
    else {
        let lines = data.split('\n');

        for (let i = 4; i < lines.length - 1; i++) {
            let columns = lines[i].split(',');
            if (!columns[0]) continue;
            let temp = {
                "key": columns[0],
                "name": cleanString(columns[10]),
                "icon": columns[11],
                "recipe": null
            };

            if (temp.name) {
                items.push(temp);
            }
        }
    }

    console.log(`${items.length} items loaded`);
    loadComplete();
}

function handleRecipeLoad(err, data) {
    console.log("Parsing Recipes");

    if (err) {
        console.error(err);
    }
    else {
        let lines = data.split('\n');

        for (let i = 4; i < lines.length - 1; i++) {
            let columns = lines[i].split(',');
            let recipe;

            // If this is a blank line, skip processing it
            if (!columns[0]) continue;

            // Prase recipe
            recipe = {
                "key": columns[mappings.recipe.key],
                "number": columns[mappings.recipe.number],
                "craftType": cleanString(columns[mappings.recipe.craftType]),
                "recipeLevelTable": cleanString(columns[mappings.recipe.recipeLevel]),
                "itemName": cleanString(columns[mappings.recipe.itemName]),
                "craftedAmount": columns[mappings.recipe.craftedAmount],
                "requiredItems": parseRecipe(columns)
            };

            // Put the recipe on the array
            recipes.push(recipe);
        }

    }

    console.log(`${recipes.length} recipes loaded`);
    loadComplete();
    console.log(recipes[6]);
}

function parseRecipe(columns) {
    let output = [];

    for (let i = 0; i < 8; i++) {
        let tempItem = parseRecipeItem(columns, mappings.recipe.items[i]);

        if (tempItem) {
            output.push(tempItem);
        }
    }

    return output;
}

function parseRecipeItem(columns, itemMapping) {

    let output = {
        item: cleanString(columns[itemMapping.name]),
        quantity: columns[itemMapping.quantity]
    };

    if (output.item && output.item !== "") {
        return output;
    }
    else {
        return undefined;
    }

}

function cleanString(input) {
    if (!input) return undefined;

    if (input.charAt(0) === "\"") {
        input = input.substring(1);
    }

    if (input.charAt(input.length - 1) === "\"") {
        input = input.substring(0, input.length - 1);
    }

    return input;
}

function loadComplete() {
    if (itemsLoaded && recipesLoaded) {
        onLoadCallback({ recipes: recipes, items: items });
    }
}