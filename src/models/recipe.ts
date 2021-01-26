export class Recipe {
    public Number: number;
    public CraftType: string;
    public RecipeLevelTable: string;
    public ItemResult: ItemAndAmount;
    public ItemIngredient: ItemAndAmount[];
}

export class ItemAndAmount {
    item: string;
    amount: number;
}