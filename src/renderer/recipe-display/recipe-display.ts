require('module-alias/register'); // Must be the first line of code before any imports. This wires up all the aliases
import { Item, Recipe } from "@models/";
import { IpcConstants } from "@services/";
import { ipcRenderer } from 'electron';

export class RecipeDisplay {

    private $itemName: JQuery<HTMLElement>;
    private $itemDesc: JQuery<HTMLElement>;
    private $recipes: JQuery<HTMLElement>;

    constructor() {
        this.init();

        let itemToDisplay = ipcRenderer.sendSync(IpcConstants.GetLookupItemSync);
        this.updateItemDisplay(itemToDisplay);
    }

    private init() {
        this.$itemName = $("#item-name");
        this.$itemDesc = $("#item-desc");
        this.$recipes = $("#recipes");
    }

    private updateItemDisplay(item: Item) {
        this.$itemName.html(item.Name);
        this.$itemDesc.html(item.Description);
        this.$recipes.html(this.buildRecipes(item));
    }

    private buildRecipes(item: Item): string {
        let output: string = '';
        
        item.Recipe?.forEach(r => {

            let rec: string = r.CraftType;
            r.ItemIngredient.forEach(i => {
                rec += `<div>${i.amount}x ${i.item}</div>`
            });

            output += `<div style="border:1px solid black" class="m-2 p-2">${rec}</div>`
        });

        return output;
    }
}

document.addEventListener('DOMContentLoaded', _ => {
    new RecipeDisplay();
});