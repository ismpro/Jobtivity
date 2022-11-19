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



function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}

function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromInput.value = from;
    }
}

function controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
        toSlider.value = from;
    }
}

function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max - to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector('#toSlider');
    if (Number(currentTarget.value) <= 0) {
        toSlider.style.zIndex = 2;
    } else {
        toSlider.style.zIndex = 0;
    }
}

window.addEventListener("DOMContentLoaded", function () {
    const fromSlider = document.getElementById('fromSlider');
    const toSlider = document.getElementById('toSlider');
    const fromInput = document.getElementById('fromInput');
    const toInput = document.getElementById('toInput');
    const areaDiv = document.getElementById("areaDiv");

    let arr = jobsConst.map(job => job.valor);
    let max = Math.max(...arr);
    let min = Math.min(...arr);

    fromSlider.max = max;
    fromSlider.min = min;
    fromSlider.value = min;

    toSlider.min = min;
    toSlider.max = max;
    toSlider.value = max;

    fromInput.max = max;
    fromInput.min = min;
    fromInput.value = min;

    toInput.max = max;
    toInput.min = min;
    toInput.value = max;

    let ul = document.createElement("ul")
    areaDiv.appendChild(ul);

    let arrArea = [];

    for (const job of jobsConst) {

        let areaControl = false;

        let li = document.createElement("li");
        let btn = document.createElement("button");

        btn.innerHTML = `${job.area} <span id="span${job.area}"></span>`;
        btn.addEventListener("click", () => {
            let index = arrArea.findIndex(area => job.area === area);
            if(index === -1) {
                document.getElementById(`span${job.area}`).innerText = "(X)";
                arrArea.push(job.area)
            } else {
                document.getElementById(`span${job.area}`).innerText = "";
                arrArea.splice(index, 1)
            }

            if(!arrArea.length) {
                filterController.remove(`area`);
            } else {
                filterController.add({
                    type: `area`,
                    fn: (jobF) => arrArea.includes(jobF.area)
                });
            }
            areaControl = !areaControl;
        })

        li.appendChild(btn)
        ul.appendChild(li)
    }

    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    setToggleAccessible(toSlider);

    function sliderFilter() {
        filterController.add({
            type: "valor",
            fn: (job) => job.valor >= fromSlider.value && job.valor <= toSlider.value
        });
    }

    fromSlider.addEventListener("input", () => controlFromSlider(fromSlider, toSlider, fromInput))
    toSlider.addEventListener("input", () => controlToSlider(fromSlider, toSlider, toInput))
    fromInput.addEventListener("input", () => controlFromInput(fromSlider, fromInput, toInput, toSlider))
    toInput.addEventListener("input", () => controlToInput(toSlider, fromInput, toInput, toSlider))
    fromSlider.addEventListener("change", sliderFilter);
    fromInput.addEventListener("change", sliderFilter);
    toSlider.addEventListener("change", sliderFilter);
    toInput.addEventListener("change", sliderFilter);

})

window.addEventListener("DOMContentLoaded", onLoad)