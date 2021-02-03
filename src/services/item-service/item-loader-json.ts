import path from 'path';
import fs from 'fs';
import { app } from 'electron';

import { Item, Recipe } from "@models/*";
import { IItemLoader } from "./iitem-loader";

export class ItemLoaderJson implements IItemLoader {
    loadData(onLoadCallback: Function): void {
        throw new Error('Method not implemented.');
    }

    loadDataSync(): {items: Item[], recipes: Recipe[]} {
        console.log("Loading from json");
        let itemPath = path.join(app.getAppPath(), '/data/Item.json');
        let recipePath = path.join(app.getAppPath(), '/data/Recipe.json');
        
        let items: Item[] = JSON.parse(fs.readFileSync(itemPath, 'utf-8'));
        let recipes: Recipe[] = JSON.parse(fs.readFileSync(recipePath, 'utf-8'));

        return {items: items, recipes: recipes};
    }

}