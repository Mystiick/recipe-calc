# recipe-calc
## A Crafting Recipe calculator for Final Fantasy XIV

A simple Electron application that reads JSON files containing FFXIV item and recipe data, and displays all required materials along with the crafting tree for the item.

## Dependencies
Dependant on JSON extracted from https://github.com/Mystiick/SaintCoinach. To extract, you will need to compile SaintCoinach and run:
`saintcoinach.cmd "{path-to-ffxiv-install}" "json Recipe Item"`. This will extract the files you need which you can place inside the data folder in the root of the application.

It is required that you extract the JSON on your own. There is no API for this out of the box for now.
