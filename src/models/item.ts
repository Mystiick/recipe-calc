import { Recipe } from "./recipe";

export class Item {
    public Key: number;
    public Name: string;
    public Description: string;
    public Icon: string;
    public Recipe: Recipe | undefined;
    public ItemUICategory: string;
    public LevelItem: number; // ilvl
    public LevelEquip: number; // class level requirement
    public Rarity: number;
    public ClassJobCategory: string;

    constructor(input: any) {
        this.Key = input.Key;
        this.Name = input.Name;
        this.Icon = input.Icon;
    }
}