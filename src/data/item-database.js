const mappings = require('./mappings');
const fs = require('fs');
const path = require('path');
const csv = require('./csv-reader');

module.exports = {
    load: callback => {
        console.log("Starting Load");
        onLoadCallback = callback;

        let itemPath = path.join(__dirname, '../../data/Item.csv');
        let recipePath = path.join(__dirname, '../../data/Recipe.csv');

        fs.readFile(itemPath, 'utf-8', handleItemLoad);
        fs.readFile(recipePath, 'utf-8', handleRecipeLoad);
    },
    find: itemName => {
        console.log(`finding ${itemName}`);
        let returnVal = items.filter(x => x.name.toLowerCase().includes(itemName.toLowerCase()));
        return returnVal;
    },
    loadTwoElectricBoogaloo: load
}

let recipes = [];
let items = [];
let itemsLoaded = false;
let recipesLoaded = false;
let onLoadCallback = undefined;

function load(callback) {
    console.log("Starting Load");
    onLoadCallback = callback;

    let itemPath = path.join(__dirname, '../../data/Item.csv');
    let recipePath = path.join(__dirname, '../../data/Recipe.csv');

    fs.readFile(itemPath, 'utf-8', handleItemLoad);
    fs.readFile(recipePath, 'utf-8', handleRecipeLoad);
}

function handleItemLoad(err, data) {
    console.log("Parsing Items");

    if (err) {
        console.error(err);
    }
    else {
        let lines = csv.parse(data, 4);

        for (let i = 4; i < lines.length - 1; i++) {
            let columns = lines[i];
            if (!columns[0]) continue;
            let temp = {
                "key": columns[0],
                "name": columns[10],
                "icon": columns[11],
                "recipe": null
            };

            if (temp.name) {
                items.push(temp);
            }
        }
    }

    console.log(`${items.length} items loaded`);
    itemsLoaded = true;
    loadComplete();
}

function handleRecipeLoad(err, data) {
    console.log("Parsing Recipes");

    if (err) {
        console.error(err);
    }
    else {
        let lines = csv.parse(data, 4);

        for (let i = 4; i < lines.length - 1; i++) {
            let columns = lines[i];
            let recipe;

            // If this is a blank line, skip processing it
            if (!columns[0]) continue;

            // Prase recipe
            recipe = {
                "key": columns[mappings.recipe.key],
                "number": columns[mappings.recipe.number],
                "craftType": columns[mappings.recipe.craftType],
                "recipeLevelTable": columns[mappings.recipe.recipeLevel],
                "itemName": columns[mappings.recipe.itemName],
                "craftedAmount": columns[mappings.recipe.craftedAmount],
                "requiredItems": parseRecipe(columns)
            };

            // Put the recipe on the array
            recipes.push(recipe);
        }

    }

    console.log(`${recipes.length} recipes loaded`);
    recipesLoaded = true;
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
        item: columns[itemMapping.name],
        quantity: columns[itemMapping.quantity]
    };

    if (output.item && output.item !== "") {
        return output;
    }
    else {
        return undefined;
    }

}

function loadComplete() {
    if (itemsLoaded && recipesLoaded) {
        if (onLoadCallback) {
            onLoadCallback({ recipes: recipes, items: items });
        }
    }
}