import { Item, Recipe } from "@models/";
import { ipcRenderer } from 'electron';

let $txtItemName: JQuery<HTMLElement>;
let $btnSearch: JQuery<HTMLElement>;
let $searchResults: JQuery<HTMLElement>;
let $spinner: JQuery<HTMLElement>;

document.addEventListener('DOMContentLoaded', _ => {
    ipcRenderer.send('load-data-start');
    ipcRenderer.on('receive-recipe', reciveRecipe);
    ipcRenderer.on('receive-item', receiveItem)
});

window.onload = () => {
    init();

    $btnSearch.on('click', _ => {
        ipcRenderer.send('search-item', $txtItemName.val());
        $searchResults.html("");
        $btnSearch.attr('disabled', '');
        $spinner.show();
    });
};

function init() {
    $btnSearch = $("#btnSearch");
    $searchResults = $("#searchResults");
    $txtItemName = $("#txtItemName");
    $spinner = $("#spinner");
}

function buildItemPreview(item: Item) {
    let $output: JQuery<HTMLElement> = $(`
    <div class="item-preview card" id="item-${item.Key}">
        <div class="card-body">
            <h5 class="card-title">${item.Name}</h5>
            <h6 class="card-subtitle text-muted">${item.Key}</h6>
            <div>${item.Icon}</div>
        </div>
    </div>`);

    $output.on('click', () => { displayRecipe($output) });
    $output.data('item', item);

    return $output;
}

function receiveItem(sennder: any, results: Item[]) {
    let $resultsHtml: JQuery<HTMLElement> = $(`<div><h3>${results.length} total ${results.length > 1 ? 'results' : 'result'} matching "${$txtItemName.val()}"</h3></div>`);

    results.forEach((r: Item) => {
        $resultsHtml.append(buildItemPreview(r));
    });

    $searchResults.html("").append($resultsHtml);

    $spinner.hide();
    $btnSearch.attr('disabled', null);
}

function displayRecipe($item: JQuery<HTMLElement>) {
    let item: Item = $item.data('item');
    console.log('recipe', item.Recipe);    
}

// Referenced in item-preview
function lookupRecipe(itemName: string, $this: JQuery<HTMLElement>) {
    ipcRenderer.send('get-recipe', itemName);
}

function reciveRecipe(_sender: any, arg: Recipe){
    console.log("arg", arg);

    // TODO: Display arg somehow on the UI
}