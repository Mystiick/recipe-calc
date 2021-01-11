# recipe-calc
## A Crafting Recipe calculator for Final Fantasy XIV

A simple Electron application that reads CSV files containing FFXIV item and recipe data, and displays all required materials along with the crafting tree for the item.

## Dependencies
Dependant on CSVs extracted from https://github.com/ufx/SaintCoinach. To extract, you can download a release of SaintCoinach and run:
`saintcoinach.cmd "{path-to-ffxiv-install}" "exd Recipe Item"`. This will extract the files you need which you can place inside the data folder in the root of the application.

!! It is required that you extract the CSVs on your own. There is no API for this out of the box for now.

## Extending
It would be possible to extend item-database.js to be more flexible allowing it to read more than just CSVs for FFIX. This flexibility is on the roadmap if one were to exist.
