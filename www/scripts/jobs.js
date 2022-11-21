"use strict";

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
    validade: new Date("2023-12-31")
},
{
    nome: "Siemens",
    descricao: "Analista de dados",
    area: Area.Database,
    duracao: 24,
    valor: 1800,
    validade: new Date("2024-10-31")
},
{
    nome: "Closure",
    descricao: "Fazem tudo",
    area: Area.SysAdmin,
    duracao: 45,
    valor: 2000,
    validade: new Date("2024-12-31")
},
{
    nome: "Closure",
    descricao: "Fazem tudo so que ao contrario",
    area: Area.Dev,
    duracao: 45,
    valor: 1540,
    validade: new Date("2023-02-23")
}];

const jobsConst = jobsObj.slice()
Object.freeze(jobsConst)

var sort = {
    type: "",
    asc: false
};

function onLoad() {

    const mainSection = document.getElementById("section_jobs");

    while (mainSection.hasChildNodes()) {
        mainSection.firstChild.remove();
    }

    jobsObj.forEach(element => {

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
        available.appendChild(document.createTextNode("Offer available until " + element.validade.toLocaleString().split(',')[0]));

        mainSection.appendChild(cardContainer);

    });
}

function onSort(type) {
    if (type !== "remove") {
        if (sort.type === type) {
            sort.asc = !sort.asc;
            document.getElementById(`${sort.type}Btn`).innerText = sort.asc ? "(asc)" : "(desc)";
        } else {
            if (sort.type) document.getElementById(`${sort.type}Btn`).innerText = "";
            document.getElementById(`${type}Btn`).innerText = "(desc)";
            sort.type = type;
            sort.asc = false;
        }
        jobsObj.sort((a, b) => sort.asc ? a[sort.type] - b[sort.type] : b[sort.type] - a[sort.type])
    } else {
        if (sort.type) document.getElementById(`${sort.type}Btn`).innerText = "";
        sort = {
            type: "",
            asc: false
        }
        jobsObj = jobsConst;
    }
    onLoad()
}

const filterController = (function () {
    const filters = [];

    let filterDOM = function () {
        jobsObj = jobsConst.filter((job) => filters.every(filter => filter.fn(job)))
        onLoad();
    }

    /**
     * 
     * @param {{type: String, fn: Function}} obj 
     */
    let addFilter = function (obj) {
        let filter = filters.find(filter => filter.type === obj.type)
        if (filter) {
            filter.fn = obj.fn;
        } else {
            filters.push(obj)
        }
        filterDOM();
    }

    /**
     * 
     * @param {String} type 
     */
    let removeFilter = function (type) {
        let index = filters.findIndex(filter => filter.type === type);
        if (index === -1) return;
        filters.splice(index, 1);
        filterDOM();
    }

    return {
        add: addFilter,
        remove: removeFilter
    }
}())

function createFilterButtons(id, key) {
    const div = document.getElementById(id);
    let ul = document.createElement("ul");
    let arrControl = [];
    const datas = new Set(jobsConst.map(e => e[key]));

    for (const data of datas) {

        let li = document.createElement("li");
        let btn = document.createElement("button");

        btn.innerHTML = `${data} <span id="span${data}"></span>`;
        btn.addEventListener("click", () => {
            let index = arrControl.findIndex(ele => data === ele);
            if (index === -1) {
                document.getElementById(`span${data}`).innerText = "(X)";
                arrControl.push(data)
            } else {
                document.getElementById(`span${data}`).innerText = "";
                arrControl.splice(index, 1)
            }

            if (!arrControl.length) {
                filterController.remove(key);
            } else {
                filterController.add({
                    type: key,
                    fn: (job) => arrControl.includes(job[key])
                });
            }
        })

        li.appendChild(btn)
        ul.appendChild(li)
    }
    div.appendChild(ul)
}

window.addEventListener("DOMContentLoaded", function () {
    const sliderValor = document.getElementById('sliderValor');
    const inputValor = document.getElementById('inputValor');

    let arr = jobsConst.map(job => job.valor);
    let max = Math.max(...arr);
    let min = Math.min(...arr);

    sliderValor.max = max;
    sliderValor.min = min;
    sliderValor.value = min;

    inputValor.min = min;
    inputValor.max = max;
    inputValor.value = min;

    createFilterButtons("filterDiv", "area");
    createFilterButtons("filterDiv", "nome");

    function sliderFilter() {
        filterController.add({
            type: "valor",
            fn: (job) => job.valor >= sliderValor.value || job.valor >= inputValor.value
        });
    }

    sliderValor.addEventListener("input", () => {
        inputValor.value = sliderValor.value;
    })
    inputValor.addEventListener("input", () => {
        sliderValor.value = inputValor.value;
    })
    sliderValor.addEventListener("change", sliderFilter);
    inputValor.addEventListener("change", sliderFilter);

})

window.addEventListener("DOMContentLoaded", onLoad)