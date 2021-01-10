const fs = require('fs');
const { ipcRenderer } = require('electron');

let txtItemName, btnSearch, searchResults;
let itemResult;

document.addEventListener('DOMContentLoaded', _ => {
    ipcRenderer.send('load-data-start');
});

window.onload = _ => {
    init();

    btnSearch.onclick = (e) => {
        let results = ipcRenderer.sendSync("search-item", txtItemName.value);

        let resultsHtml = `<h3>${results.length} Total Results</h3><ul>`;


        results.forEach(r => {
            resultsHtml += `<li>${r.name}</li>`;
        });
        resultsHtml += "</ul>"

        searchResults.innerHTML = resultsHtml;
    };
};

function init() {
    txtItemName = document.getElementById("txtItemName");
    btnSearch = document.getElementById("btnSearch");
    searchResults = document.getElementById("searchResults");
}