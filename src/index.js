const fs = require('fs');
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
    ipcRenderer.send('load-data-start');
}