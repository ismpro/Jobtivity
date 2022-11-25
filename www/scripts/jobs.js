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

        const div = document.createElement("div");
        div.style = "border-style: none;";
        div.className = "row g-0";
        div.innerHTML =
            `
        <div class="col" style="border-style: none;">
        <div class="card"
            style="box-shadow: 0px 0px;border-style: solid;border-radius: 20px;">
            <div class="card-body" style="border-style: none;">
                <div class="row" style="border-style: none;height: 30px;">
                    <div class="col">
                        <h1 style="width: 100%;">${element.nome}</h1>
                    </div>
                    <div class="col">
                        <h3 style="text-align: right;">${element.area}</h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xl-10">
                        <p
                            style="width: 100%;min-width: 100px;text-align: left;overflow: scroll;overflow-y: auto;overflow-x: visible;max-height: 150px;">
                            <br><span style="color: rgb(0, 0, 0);">${element.descricao}</span><br><br></p>
                    </div>
                    <div class="col" style="width: 141.5px;">
                        <p class="d-xl-flex justify-content-xl-center align-items-xl-center"
                            style="text-align: right;margin: 0px;height: 100%;">${element.valor}€
                        </p>
                    </div>
                </div>
                <div class="row" style="height: 50px;">
                    <div class="col">
                        <p><br><strong><span style="color: rgb(0, 0, 0);">Contract for
                        ${element.duracao} months</span></strong><br><br></p>
                    </div>
                    <div class="col">
                        <p style="text-align: right;"><br><strong><span
                                    style="color: rgb(0, 0, 0);">Offer available until
                                    ${element.validade.toLocaleString().split(',')[0]}</span></strong><br><br></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `
        /* cardContainer.className = "cardContainer";

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
        available.appendChild(document.createTextNode("Offer available until " + element.validade.toLocaleString().split(',')[0])); */

        mainSection.appendChild(div);

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

function createFilterButtons(id, key, title) {

    const parent = document.getElementById(id);
    const parentCollapse = document.getElementById(id + "Collapse");
    parent.innerHTML = `<h3>${title}</h3>`;
    parentCollapse.innerHTML = `<h3>${title}</h3>`;

    let arrControl = [];
    const datas = new Set(jobsConst.map(e => e[key]));

    for (const data of datas) {

        console.log(data)

        let div = document.createElement("div");
        let input = document.createElement("input");
        let label = document.createElement("label");

        div.className = "form-check";

        input.className = "form-check-input";
        input.type = "checkbox";
        input.id = "formCheck-" + data;

        label.className = "form-check-label";
        label.htmlFor = "formCheck-" + data;
        label.appendChild(document.createTextNode(data));

        let divCollapse = document.createElement("div");
        let inputCollapse = document.createElement("input");
        let labelCollapse = document.createElement("label");

        divCollapse.className = "form-check";

        inputCollapse.className = "form-check-input";
        inputCollapse.type = "checkbox";
        inputCollapse.id = "formCheck-" + data;

        labelCollapse.className = "form-check-label";
        labelCollapse.htmlFor = "formCheck-" + data;
        labelCollapse.appendChild(document.createTextNode(data));

        /* 
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="formCheck-5">
            <label class="form-check-label" for="formCheck-5">Samsung</label>
        </div>
        */

        const eventClicker = (bool) => {
            if (bool) {
                arrControl.push(data);
            } else {
                arrControl.splice(arrControl.findIndex(ele => data === ele), 1);
            }

            if (!arrControl.length) {
                filterController.remove(key);
            } else {
                filterController.add({
                    type: key,
                    fn: (job) => arrControl.includes(job[key])
                });
            }
        }

        input.addEventListener("click", (e) => {
            inputCollapse.checked = input.checked;
            eventClicker(input.checked);
        })
        inputCollapse.addEventListener("click", (e) => {
            input.checked = inputCollapse.checked;
            eventClicker(inputCollapse.checked);
        })

        divCollapse.appendChild(labelCollapse);
        divCollapse.appendChild(inputCollapse);
        parentCollapse.appendChild(divCollapse);

        div.appendChild(label);
        div.appendChild(input);
        parent.appendChild(div);
    }
    
}

window.addEventListener("DOMContentLoaded", function () {
    const sliderValor = document.getElementById('sliderValor');
    const inputValor = document.getElementById('inputValor');
    const sliderValorCollapse = document.getElementById('sliderValorCollapse');
    const inputValorCollapse = document.getElementById('inputValor');

    let arr = jobsConst.map(job => job.valor);
    let max = Math.max(...arr);
    let min = Math.min(...arr);

    sliderValor.max = max;
    sliderValor.min = min;
    sliderValor.value = min;

    inputValor.min = min;
    inputValor.max = max;
    inputValor.value = min;

    sliderValorCollapse.max = max;
    sliderValorCollapse.min = min;
    sliderValorCollapse.value = min;

    inputValorCollapse.min = min;
    inputValorCollapse.max = max;
    inputValorCollapse.value = min;

    createFilterButtons("areaFilter", "area", "Area");
    createFilterButtons("empresaFilter", "nome", "Empresas");

    function sliderFilter() {
        filterController.add({
            type: "valor",
            fn: (job) => job.valor >= sliderValor.value || job.valor >= inputValor.value
                || job.valor >= sliderValorCollapse.value || job.valor >= inputValorCollapse.value
        });
    }

    sliderValor.addEventListener("input", () => {
        inputValor.value = sliderValor.value;
        sliderValorCollapse.value = sliderValor.value;
        inputValorCollapse.value = sliderValor.value;
    })
    inputValor.addEventListener("input", () => {
        sliderValor.value = inputValor.value;
        sliderValorCollapse.value = inputValor.value;
        inputValorCollapse.value = inputValor.value;
    })
    sliderValorCollapse.addEventListener("input", () => {
        sliderValor.value = sliderValorCollapse.value;
        inputValor.value = sliderValorCollapse.value;
        inputValorCollapse.value = sliderValorCollapse.value;
    })
    inputValorCollapse.addEventListener("input", () => {
        sliderValor.value = inputValorCollapse.value;
        inputValor.value = inputValorCollapse.value;
        sliderValorCollapse.value = inputValorCollapse.value;
    })

    sliderValor.addEventListener("change", sliderFilter);
    inputValor.addEventListener("change", sliderFilter);
    sliderValorCollapse.addEventListener("change", sliderFilter);
    inputValorCollapse.addEventListener("change", sliderFilter);

})

window.addEventListener("DOMContentLoaded", onLoad)