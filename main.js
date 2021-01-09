const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const database = require('./src/data/item-database.js');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
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
  database.load((results) => {console.log("load finished")});
});