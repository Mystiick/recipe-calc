import { Item } from "../models";
import fs from 'fs';
import { ipcRenderer } from 'electron';

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

function buildItemPreview(item: Item) {
    return `
    <div class="item-preview" id="item-${item.Key}" onclick="doThing('${escape(item.Name)}')">
        <div>${item.Name}</div>
        <div>${item.Key}</div>
        <div>${item.Icon}</div>
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