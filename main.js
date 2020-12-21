const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

let recipes;
let items;

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL("file://" + __dirname + "/src/index.html");

  win.webContents.openDevTools()
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
  console.log("starting load");
  let recipePath = path.join(__dirname, 'data/Recipe.csv');

  fs.exists(recipePath, (exists) => {
    
    if (exists){
      console.log('file exists');
      fs.readFile(recipePath, 'utf-8', handleRecipeLoad);
    }
    else {
      ipcMain.send('load-data-finish', undefined);
    }

  });

  // let data = fs.readFileSync("./data/data.json", 'utf8');
  // // let obj = JSON.parse(data);

  // document.getElementById("loading").innerText = "Loaded";

  // // document.getElementById("testResult").innerText = obj.test;
  // // document.getElementById("wasSuccess").innerText = obj.success;
  // document.getElementById("contents").style = "";
});

// TODO: Move into its own Recipe file
function handleRecipeLoad(err, data){
  if (err) {
    alert(err.message);
  }
  else {
    
    let lines = data.split('\n');
    let recipes = [];

    console.log(lines[3]);

    for (let i = 3; i < lines.length - 1; i++){
      let columns = lines[i].split(',');
      if (!columns[0]) continue;

      recipes.push({
        "key": columns[0],
        "number": columns[1],
        "craftType": cleanString(columns[2]),
        "recipeLevelTable": cleanString(columns[3]),
        "itemName": cleanString(columns[4]),
        "craftedAmount": columns[5],
        "requiredItems": parseRecipe(columns)
      });
    }

    console.log(recipes[1]);
  }
}

function cleanString(input) {
  if (input.charAt(0) === "\""){
    input = input.substring(1);
  }

  if (input.charAt(input.length - 1) === "\""){
    input = input.substring(0, input.length - 1);
  }

  return input;
}

function parseRecipe() {
  
}