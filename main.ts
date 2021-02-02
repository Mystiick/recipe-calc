require('module-alias/register'); // Must be the first line of code before any imports. This wires up all the aliases
import { app, BrowserWindow, ipcMain } from 'electron';
import { SettingsService, ItemService } from '@services/';
import { IItemLoader, ItemLoaderCsv, ItemLoaderJson } from '@services/item-service/';


let settings: SettingsService;
let database: ItemService;
let itemLoader: IItemLoader;
bootstrap();

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
    database.load();
});
// TODO: Move into its own IPC Main file?
ipcMain.on('search-item', (event, arg) => {
    // TODO: Add some way to pass in true/false from a checkbox to include all items without recipes
    event.reply('receive-item', database.find(arg, false));
});
// TODO: Move into its own IPC Main file?
ipcMain.on('get-recipe', (event, arg) => {
    console.log(`getting recipe for ${arg}`);

    let returnVal = database.lookupRecipe(arg);
    event.reply('receive-recipe', returnVal);
});

function bootstrap() {
    console.log("bootstrapping");
    settings = new SettingsService();
    itemLoader = new ItemLoaderJson();
    database = new ItemService(itemLoader);
}