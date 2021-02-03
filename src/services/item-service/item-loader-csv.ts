import { Item, Mappings } from "@models/";
import { IItemLoader } from "./iitem-loader";
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { CsvReader } from "./csv-reader";

export class ItemLoaderCsv implements IItemLoader {

    private onLoadCallback: Function;
    private recipes: Array<any> = [];
    private items: Array<Item> = [];
    private csv: CsvReader;
    
    private itemsLoaded: boolean = false;
    private recipesLoaded: boolean = false;
    
    constructor() {
        this.csv = new CsvReader();
    }

    public loadData(callback: Function): void {
        this.onLoadCallback = callback;
        
        let itemPath = path.join(app.getAppPath(), '/data/Item.csv');
        let recipePath = path.join(app.getAppPath(), '/data/Recipe.csv');
        
        fs.readFile(itemPath, 'utf-8', (a,b) => {this.handleItemLoad(a,b, this); });
        fs.readFile(recipePath, 'utf-8', (a,b) => {this.handleRecipeLoad(a,b, this); });
    }

    public loadDataSync(): any {
        let output: any = {};
        let itemPath = path.join(app.getAppPath(), '/data/Item.csv');
        let recipePath = path.join(app.getAppPath(), '/data/Recipe.csv');
        
        output.items = this.handleItemLoad(null, fs.readFileSync(itemPath, 'utf-8'), this);
        output.recipes = this.handleRecipeLoad(null, fs.readFileSync(recipePath, 'utf-8'), this);

        return output;
    }

    private handleItemLoad(err, data, that: ItemLoaderCsv) {
        console.log("Parsing Items");
        this.items = [];

        if (err) {
            console.error(err);
        }
        else {
            let lines = that.csv.parse(data, 4);

            for (let i = 4; i < lines.length - 1; i++) {
                let columns: string[] = lines[i];

                if (!columns[0]) continue;
                let temp = new Item({
                    Key: +columns[0],
                    Name: columns[10],
                    Icon: columns[11]
                });

                if (temp.Name) {
                    this.items.push(temp);
                }
            }
        }

        console.log(`${this.items.length} items loaded`);
        this.itemsLoaded = true;
        this.loadComplete();
        return this.items;
    }

    private handleRecipeLoad(err, data, obj: ItemLoaderCsv) {
        console.log("Parsing Recipes");

        this.recipes = [];

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
                throw new Error('Method not implemented.');
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
        return this.recipes;
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