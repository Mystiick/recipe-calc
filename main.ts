const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
import { ItemDatabase } from './src/data/item-database';

let database: ItemDatabase = new ItemDatabase();

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 850,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(`file://${__dirname}/src/renderer/item-display.html`);

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
    database.load((results) => { console.log("load finished") });
});
// TODO: Move into its own IPC Main file?
ipcMain.on('search-item', (event, arg) => {
    event.returnValue = database.find(arg);
});
// TODO: Move into its own IPC Main file?
ipcMain.on('get-recipe', (event, arg) => {
    console.log(`getting recipe for ${arg}`);
    console.log(arg);

    let returnVal = database.lookupRecipe(arg);
    event.reply('receive-recipe', returnVal);
});
