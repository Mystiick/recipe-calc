const fs = require('fs');
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', _ =>
{
    ipcRenderer.send('load-data-start');
});

