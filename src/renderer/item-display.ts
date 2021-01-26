import { Item } from "../models";
import { ipcRenderer } from 'electron';

let $txtItemName: JQuery<HTMLElement>;
let $btnSearch: JQuery<HTMLElement>;
let $searchResults: JQuery<HTMLElement>;

document.addEventListener('DOMContentLoaded', _ => {
    ipcRenderer.send('load-data-start');
    ipcRenderer.on('receive-recipe', reciveRecipe);
});

window.onload = () => {
    init();

    $btnSearch.on('click', _ => {
        let results = ipcRenderer.sendSync("search-item", $txtItemName.val());

        let $resultsHtml: JQuery<HTMLElement> = $(`<div><h3>${results.length} Total Results matching "${$txtItemName.val()}"</h3></div>`);

        results.forEach((r: Item) => {
            $resultsHtml.append(buildItemPreview(r));
        });

        $searchResults.html("").append($resultsHtml);
    });
};

function init() {
    $btnSearch = $("#btnSearch");
    $searchResults = $("#searchResults");
    $txtItemName = $("#txtItemName");
}

function buildItemPreview(item: Item) {
    return $(`<div class="item-preview" id="item-${item.Key}">
                <div>${item.Name}</div>
                <div>${item.Key}</div>
                <div>${item.Icon}</div>
            </div>`)
        .on("click", _ => { lookupRecipe(item.Name); } );
}

// Referenced in item-preview
function lookupRecipe(itemName: string) {
    ipcRenderer.send('get-recipe', itemName);
}

function reciveRecipe(sender, arg){
    console.log("arg", arg);

    // TODO: Display arg somehow on the UI
}