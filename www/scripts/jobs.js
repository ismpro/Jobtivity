const Area = {
    Dev: "Programação",
    Database: "Base de Dados",
    SysAdmin: "Administração de Sistemas"
}


var jobsObj = [{
        nome: "Deloitte",
        descricao: "Procuramos programador de React que seja bastante bom a tocar flauta de olhos vendados enquanto descasca uma maçã com os dedos dos pés. Oferecemos  remuneração  simpática. Pena é não terem tempo livre para aproveitar o salário.",
        area: Area.Dev,
        duracao: 12,
        valor: 1500,
        validade: new Date("2023-12-31").toLocaleString().split(',')[0]
    },
    {
        nome: "Siemens",
        descricao: "Analista de dados",
        area: Area.Database,
        duracao: 24,
        valor: 1800,
        validade: new Date("2024-10-31").toLocaleString().split(',')[0]
    }
]

function onLoad(){
    jobsObj.forEach(element =>{
        const mainSection = document.getElementById("section_jobs");
        const cardContainer = document.createElement("section");
        cardContainer.className = "cardContainer";
        
        const titleHeading = document.createElement("h3");
        const area = document.createElement("p");
        const description = document.createElement("p");
        const duration = document.createElement("p");
        const money = document.createElement("p");
        const available = document.createElement("p");
    
        titleHeading.className = "title";
        area.className = "area";
        description.className = "description";
        duration.className = "duration";
        money.className = "money";
        available.className = "available";
    
        cardContainer.appendChild(titleHeading);
        cardContainer.appendChild(area);
        cardContainer.appendChild(description);
        cardContainer.appendChild(duration);
        cardContainer.appendChild(money);
        cardContainer.appendChild(available);
    
        titleHeading.appendChild(document.createTextNode(element.nome));
        description.appendChild(document.createTextNode(element.descricao));
        duration.appendChild(document.createTextNode("Contract for " + element.duracao + " months"));
        area.appendChild(document.createTextNode(element.area));
        money.appendChild(document.createTextNode(element.valor + "€"));
        available.appendChild(document.createTextNode("Offer available until " + element.validade));
    
        mainSection.appendChild(cardContainer);
      
    });
}

window.onload = onLoad;


