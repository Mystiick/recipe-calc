export interface IItemLoader {

    loadData(onLoadCallback: Function): void;
    loadDataSync(): any;
    
}