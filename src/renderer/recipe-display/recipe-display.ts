require('module-alias/register'); // Must be the first line of code before any imports. This wires up all the aliases
import { Item, Recipe } from "@models/";
import { IpcConstants } from "@services/";
import { ipcRenderer } from 'electron';

export class RecipeDisplay {

    private $itemName: JQuery<HTMLElement>;
    private $itemDesc: JQuery<HTMLElement>;
    private $recipes: JQuery<HTMLElement>;
    private $craftingClass: JQuery<HTMLElement>;
    private $recipetop: JQuery<HTMLElement>;

    constructor() {
        this.init();

        let itemToDisplay = ipcRenderer.sendSync(IpcConstants.GetLookupItemSync);
        this.updateItemDisplay(itemToDisplay);
    }

    private init() {
        this.$itemName = $("#item-name");
        this.$itemDesc = $("#item-desc");
        this.$recipes = $("#recipes");
        this.$craftingClass = $("#crafting-class");
    }

    /**
     * Called when the Display Item is updated.
     * Builds out the entire UI
     */
    private updateItemDisplay(item: Item) {
        this.mapRecipes(item.Recipe);

        this.$itemName.html(item.Name);
        this.$itemDesc.html(item.Description);
        this.$recipes.html(this.buildRecipes(item));

        // Build out top level Class select
        this.$craftingClass.empty().append(this.buildRecipeClassOptions(item.Recipe));
        if (item.Recipe.length === 1) {
            this.$craftingClass.attr('disabled', '');
        }
    }

    /** 
     * Temp Code
     */ 
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
     * Recursive function that traverses the recipes to build out the entire recipe tree
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

    /**
     * Get Data for a recipe from ipcMain
     */
    private lookupRecipe(name: string): Recipe[] {
        return ipcRenderer.sendSync(IpcConstants.GetRecipesSync, name);
    }

    /**
     * Function that builds out an option list for all the recipes passed in.
     */
    private buildRecipeClassOptions(recipes: Recipe[]): string {

        let output: string = "";

        recipes.forEach(r => {
            output += `<option>${r.CraftType}</option>`;
        });

        return output;
    }
}


document.addEventListener('DOMContentLoaded', _ => {
    new RecipeDisplay();
});