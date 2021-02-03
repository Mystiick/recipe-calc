import { Item, Recipe } from '@models/index';
import { IItemLoader } from './iitem-loader';

export class ItemService {
    private recipes: Array<Recipe> = [];
    public items: Array<Item> = [];

    constructor(protected loader: IItemLoader) {
        
    }

    public load() {        
        let output: any = this.loader.loadDataSync();
    
        this.items = output.items;
        this.recipes = output.recipes;
    }

    public find(itemName: string, includeAll: boolean): Item[] {
        console.log(`finding ${itemName}`);

        let returnVal: Item[] = this.items.filter(x => x.Name.toLowerCase().includes(itemName.toLowerCase()));

        returnVal.forEach(x => {
            x.Recipe = this.lookupRecipe(x.Name);
        });

        if (!includeAll) {
            returnVal = returnVal.filter(x => x.Recipe && x.Recipe.length > 0);
        }
        
        return returnVal;
    }

    public lookupRecipe(itemName: string) {
        return this.recipes.filter(x => x.ItemResult.item === itemName);
    }

    private dataLoaded(output: any) {
        this.items = output.items;
        this.recipes = output.recipes;
    }
}