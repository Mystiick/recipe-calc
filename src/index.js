const fs = require('fs');

document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    

    let data = fs.readFileSync("./src/data.json", 'utf8');
    let obj = JSON.parse(data);

    document.getElementById("loading").innerText = "Loaded";

    document.getElementById("testResult").innerText = obj.test;
    document.getElementById("wasSuccess").innerText = obj.success;
    document.getElementById("contents").style = "";
}