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

        this.mapRecipes(item.Recipe);

        this.$itemName.html(item.Name);
        this.$itemDesc.html(item.Description);
        this.$recipes.html(this.buildRecipes(item));
    }

    private buildRecipes(item: Item): string {
        let output: string = '';
        
        item.Recipe.sort((a,b)=> { 
            return a.CraftType < b.CraftType ? -1 : 1
        }).forEach(r => {
            let rec: string = `<button type="button" class="btn btn-secondary" data-toggle="collapse" data-target="#${r.CraftType.toLowerCase()}" aria-expanded="false" aria-controls="${r.CraftType.toLowerCase()}">${r.CraftType}</button>
            <div id="${r.CraftType.toLowerCase()}" class="collapse">`;
            r.ItemIngredient.forEach(i => {
                rec += `<div>${i.amount}x ${i.item}</div>`
            });

            output += `</div><div class="card m-1 p-1">${rec}</div>`
        });

        return output;
    }

    /**
     * Recursive function that traverses the 
     */
    private mapRecipes(recipes: Recipe[]) {
        recipes.forEach(recipe => {
            recipe.ItemIngredient.forEach(ingredient => {
                ingredient.Recipe = this.lookupRecipe(ingredient.item);

                if (ingredient.Recipe) {
                    this.mapRecipes(ingredient.Recipe);
                }
            });
        });
    }

    private lookupRecipe(name: string): Recipe[] {
        return ipcRenderer.sendSync(IpcConstants.GetRecipesSync, name);
    }
}

document.addEventListener('DOMContentLoaded', _ => {
    new RecipeDisplay();
});