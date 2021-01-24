import { Mappings } from './mappings';
import fs from 'fs';
import path from 'path';
import { CsvReader } from './csv-reader';

export class ItemDatabase {
    private recipes: Array<any> = [];
    private items: Array<any> = [];
    private itemsLoaded: boolean = false;
    private recipesLoaded: boolean = false;
    private onLoadCallback: Function | undefined;
    private csv: CsvReader;

    constructor() {
        this.csv = new CsvReader();
    }

    public load(callback: Function) {
        console.log("Starting Load");
        this.onLoadCallback = callback;

        let itemPath = path.join(__dirname, '../../data/Item.csv');
        let recipePath = path.join(__dirname, '../../data/Recipe.csv');
        let that: ItemDatabase = this;
        fs.readFile(itemPath, 'utf-8', (a,b) => {this.handleItemLoad(a,b, that); });
        fs.readFile(recipePath, 'utf-8', (a,b) => {this.handleRecipeLoad(a,b,that); });
    }

    public find(itemName: string): any {
        console.log(`finding ${itemName}`);
        let returnVal = this.items.filter(x => x.name.toLowerCase().includes(itemName.toLowerCase()));
        return returnVal;
    }

    public lookupRecipe(itemName: string) {
        console.log(`finding recipe for ${itemName}`);
        return this.recipes.filter(x => x.itemName === itemName);
    }

    private handleItemLoad(err, data, that: ItemDatabase) {
        console.log("Parsing Items");

        if (err) {
            console.error(err);
        }
        else {
            let lines = that.csv.parse(data, 4);

            for (let i = 4; i < lines.length - 1; i++) {
                let columns = lines[i];
                if (!columns[0]) continue;
                let temp = {
                    "key": columns[0],
                    "name": columns[10],
                    "icon": columns[11],
                    "recipe": null
                };

                if (temp.name) {
                    this.items.push(temp);
                }
            }
        }

        console.log(`${this.items.length} items loaded`);
        this.itemsLoaded = true;
        this.loadComplete();
    }

    private handleRecipeLoad(err, data, obj: ItemDatabase) {
        console.log("Parsing Recipes");

        if (err) {
            console.error(err);
        }
        else {
            let lines = obj.csv.parse(data, 4);

            for (let i = 4; i < lines.length - 1; i++) {
                let columns = lines[i];
                let recipe: any;

                // If this is a blank line, skip processing it
                if (!columns[0]) continue;

                // Prase recipe
                recipe = {
                    "key": columns[Mappings.recipe.key],
                    "number": columns[Mappings.recipe.number],
                    "craftType": columns[Mappings.recipe.craftType],
                    "recipeLevelTable": columns[Mappings.recipe.recipeLevel],
                    "itemName": columns[Mappings.recipe.itemName],
                    "craftedAmount": columns[Mappings.recipe.craftedAmount],
                    "requiredItems": this.parseRecipe(columns)
                };

                // Put the recipe on the array
                this.recipes.push(recipe);
            }

        }

        console.log(`${this.recipes.length} recipes loaded`);
        this.recipesLoaded = true;
        this.loadComplete();
        console.log(this.recipes[6]);
    }

    private parseRecipe(columns) {
        let output: Array<any> = [];

        for (let i = 0; i < 8; i++) {
            let tempItem: any = this.parseRecipeItem(columns, Mappings.recipe.items[i]);

            if (tempItem) {
                output.push(tempItem);
            }
        }

        return output;
    }

    private parseRecipeItem(columns, itemMapping) {

        let output = {
            item: columns[itemMapping.name],
            quantity: columns[itemMapping.quantity]
        };

        if (output.item && output.item !== "") {
            return output;
        }
        else {
            return undefined;
        }

    }

    private loadComplete() {
        if (this.itemsLoaded && this.recipesLoaded) {
            if (this.onLoadCallback) {
                this.onLoadCallback({ recipes: this.recipes, items: this.items });
            }
        }
    }
}