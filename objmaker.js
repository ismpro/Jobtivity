const fs = require("fs");
const path = require("path");
const ar = ["Financial Advisor", "Analyst Programmer", "Systems Administrator", "Professor", "Software Test Engineer", "Software Engineer", "Web Developer", "Pharmacist"];
const nam = ["Deloitte", "Amazon", "Apple", "Microsoft", "Tencent Holdings", "Oracle", "SAP", "Uber Technologies Inc.", "Shopify"];

let data = [];

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

for (let num = 0; num <= 50; num++) {

    let nome = nam[randomIntFromInterval(0, nam.length - 1)];
    let area = ar[randomIntFromInterval(0, ar.length - 1)];
    let duracao = randomIntFromInterval(0, 60);
    let valor = randomIntFromInterval(1000, 3000);
    let validade = randomDate(new Date("2023-01-01"), new Date("2025-12-31"));

    data.push({
        nome,
        descricao: `${nome} - ${area} - ${duracao} - ${valor}`,
        area,
        duracao,
        valor,
        validade
    });
}


fs.writeFileSync(path.resolve("./jobs.json"), JSON.stringify(data));