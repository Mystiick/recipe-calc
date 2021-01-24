const fs = require('fs');
const { ipcRenderer } = require('electron');

let txtItemName, btnSearch, searchResults;
let itemResult;

document.addEventListener('DOMContentLoaded', _ => {
    ipcRenderer.send('load-data-start');
    ipcRenderer.on('receive-recipe', reciveRecipe);
});

window.onload = _ => {
    init();

    btnSearch.onclick = (e) => {
        let results = ipcRenderer.sendSync("search-item", txtItemName.value);

        let resultsHtml = `<h3>${results.length} Total Results matching "${txtItemName.value}"</h3>`;


        results.forEach(r => {
            resultsHtml += `<div>${buildItemPreview(r)}</div>`;
        });

        searchResults.innerHTML = resultsHtml;
    };
};

function init() {
    txtItemName = document.getElementById("txtItemName");
    btnSearch = document.getElementById("btnSearch");
    searchResults = document.getElementById("searchResults");
}

function buildItemPreview(item) {
    return `
    <div class="item-preview" id="item-${item.key}" onclick="doThing('${escape(item.name)}')">
        <div>${item.name}</div>
        <div>${item.key}</div>
        <div>${item.icon}</div>
    </div>`
}

// Referenced in item-preview
function doThing(itemName) {
    itemName = unescape(itemName);
    ipcRenderer.send('get-recipe', itemName);
}

function reciveRecipe(sender, arg){
    console.log("arg", arg);

    // TODO: Display arg somehow on the UI
}