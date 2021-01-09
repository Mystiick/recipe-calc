const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

const mappings = require('./src/data/mappings');

let recipes = [];
let items = [];
let itemsLoaded = false;
let recipesLoaded = false;

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(`file://${__dirname}/src/index.html`);

  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// TODO: Move into its own IPC Main file?
ipcMain.on('load-data-start', () => {
  console.log("Starting Load");
  let itemPath = path.join(__dirname, 'data/Item.csv');
  let recipePath = path.join(__dirname, 'data/Recipe.csv');

  fs.readFile(itemPath, 'utf-8', handleItemLoad);
  fs.readFile(recipePath, 'utf-8', handleRecipeLoad);
});

function handleItemLoad(err, data) {
  console.log("Parsing Items");

  if (err) {
    alert(err.message);
  }
  else {
    let lines = data.split('\n');

    for (let i = 4; i < lines.length - 1; i++){
      let columns = lines[i].split(',');
      if (!columns[0]) continue;
      let temp = {
        "key": columns[0],
        "name": cleanString(columns[10]),
        "icon": columns[11],
        "recipe": null
      };

      if(temp.name) {
        items.push(temp);
      }
    }
  }

  console.log(`${items.length} items loaded`);
  loadComplete();
}

// TODO: Move into its own Recipe file
function handleRecipeLoad(err, data) {
  console.log("Parsing Recipes");

  if (err) {
    alert(err.message);
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

function loadComplete(){ 

  if(itemsLoaded && recipesLoaded){
    ipcMain.send('load-data-finish', {recipes: recipes, items: items});
  }
}

function cleanString(input) {
  if (!input) return undefined;

  if (input.charAt(0) === "\""){
    input = input.substring(1);
  }

  if (input.charAt(input.length - 1) === "\""){
    input = input.substring(0, input.length - 1);
  }

  return input;
}

function parseRecipe(columns) {
  let output = [];

  for(let i = 0; i < 8; i++){
    let tempItem = parseRecipeItem(columns, mappings.recipe.items[i]);

    if(tempItem){
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

  if (output.item && output.item !== ""){
    return output;
  }
  else {
    return undefined;
  }

}