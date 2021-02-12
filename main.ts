require('module-alias/register'); // Must be the first line of code before any imports. This wires up all the aliases
import { app, BrowserWindow, ipcMain } from 'electron';
import { SettingsService, ItemService, IItemLoader, ItemLoaderJson, IpcConstants } from '@services/';
import { Item } from '@models/*';

let settings: SettingsService;
let database: ItemService;
let itemLoader: IItemLoader;
bootstrap();

let itemToDisplay: Item;

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 850,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(`file://${__dirname}/src/renderer/item-display/item-display.html`);

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
ipcMain.on(IpcConstants.LoadDataStart, () => {
    database.load();
});
// TODO: Move into its own IPC Main file?
ipcMain.on(IpcConstants.SearchItem, (event, arg) => {
    // TODO: Add some way to pass in true/false from a checkbox to include all items without recipes
    event.reply('receive-item', database.find(arg, false));
});
// TODO: Move into its own IPC Main file?
ipcMain.on(IpcConstants.GetRecipesSync, (event: any, arg: string) => {
    event.returnValue = database.lookupRecipe(arg);
});


ipcMain.on(IpcConstants.SetLookupItem, (event: any, arg: Item) => {
    itemToDisplay = arg;
});
ipcMain.on(IpcConstants.GetLookupItemSync, (event: any, arg: any) => {
    event.returnValue = itemToDisplay;
});

function bootstrap() {
    console.log("bootstrapping");
    settings = new SettingsService();
    itemLoader = new ItemLoaderJson();
    database = new ItemService(itemLoader);
}