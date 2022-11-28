"use strict";

/**
 * Controller of the data of jobs.
 */
const dataController = (function () {

    /**
     * Const of the max cards per page
     */
    const MAXPERPAGE = 10;
    /**
     * Data used in the building of the dom
     */
    let data = [];
    /**
     * Copy of the original data without modifications
     */
    let dataOriginal = [];
    /**
     * Index of the page
     */
    let pageIndex = 0;

    /**
     * Adds data to the controller. Only use this function in the begin.
     * @param {[{ nome: String, descricao: String, area: String, duracao: Number,  valor: Number, validade: Date }]} obj Array with jobs
     */
    let add = function (obj) {
        if (!dataOriginal.length) {
            data = obj;
            dataOriginal = JSON.parse(JSON.stringify(obj));
            Object.freeze(dataOriginal);

            let sort = JSON.parse(window.sessionStorage.getItem("sort"));
            if (sort) {
                document.getElementById(`${sort.key}Icon`).innerText = sort.asc ? "keyboard_arrow_up" : "keyboard_arrow_down";
                data.sort((a, b) => sort.asc ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key])
            }

            buildDom();
        }
    }
    /**
     * Callback for the filter execute
     * @callback filterCallback
     * @param {{ nome: String, descricao: String, area: String, duracao: Number,  valor: Number, validade: Date }} job
     */
    /**
     * Filter the content of the jobs.
     * @param {filterCallback} fn The function for the filter
     */
    let filter = function (fn) {
        data = dataOriginal.filter(fn);
        buildDom();
    }

    /**
     * Sorts the content of the jobs.
     * @param {String} key Key of the jobs you want to sort by
     */
    let onSort = function (key) {
        let sort = JSON.parse(window.sessionStorage.getItem("sort"));
        if (!sort) sort = {
            key: "",
            asc: false
        };
        if (sort.key === key) {
            sort.asc = !sort.asc;
            document.getElementById(`${sort.key}Icon`).innerText = sort.asc ? "keyboard_arrow_up" : "keyboard_arrow_down";
        } else {
            if (sort.key) document.getElementById(`${sort.key}Icon`).innerText = "";
            document.getElementById(`${key}Icon`).innerText = "keyboard_arrow_down";
            sort.key = key;
            sort.asc = false;
        }
        data.sort((a, b) => sort.asc ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key])

        window.sessionStorage.setItem("sort", JSON.stringify(sort));
        buildDom();
    }

    /**
     * Reset the data of any sort or filter
     */
    let reset = function () {
        data = dataOriginal;
        let sort = JSON.parse(window.sessionStorage.getItem("sort"));
        if (sort) {
            document.getElementById(`${sort.key}Icon`).innerText = "";
        }
        window.sessionStorage.setItem("sort", JSON.stringify({
            key: "",
            asc: false
        }));
        buildDom();
    }

    /**
     * Private function to build or rebuild the dom with jobs
     */
    let buildDom = function () {

        const mainSection = document.getElementById("section_jobs");
        const nextButton = document.getElementById("nextButton");
        const previousButton = document.getElementById("previousButton");
        const pagination = document.querySelector(".pagination");

        /**
         * Rebuilds the dom content
         */
        let build = function () {

            while (mainSection.hasChildNodes()) {
                mainSection.firstChild.remove();
            }

            data.slice(pageIndex * MAXPERPAGE, (pageIndex + 1) * MAXPERPAGE).forEach((element, index) => {
                const div = document.createElement("div");
                div.className = "row g-0 card";
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
                            <div class="row">
                            <div class="col">
                                <p class="d-xl-flex justify-content-xl-start align-items-xl-center" style="height: 100%;">
                                    <br><strong><span style="color: rgb(0, 0, 0);">Contract for 12 months</span></strong><br><br>
                                </p>
                            </div>
                            <div class="col">
                                <p class="d-xl-flex justify-content-xl-end align-items-xl-center" style="text-align: right;height: 100%;">
                                    <br><strong><span style="color: rgb(0, 0, 0);">Offer available until 12/31/2023</span></strong><br><br>
                                </p>
                            </div>
                        </div>
                            <div class="row">
                                <div class="col">
                                    <div class="form-check d-flex d-xl-flex justify-content-end justify-content-sm-end justify-content-md-end justify-content-lg-end justify-content-xl-end justify-content-xxl-end">
                                        <input class="form-check-input" type="checkbox" id="compararCheck${index}" style="margin-right: 10px;">
                                        <label class="form-check-label" for="compararCheck${index}">Comparar</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
                mainSection.appendChild(div);
            });
        }

        build();

        if (data.length > MAXPERPAGE) {

            pagination.style.display = "flex";

            while (!previousButton.nextElementSibling.isSameNode(nextButton)) {
                previousButton.nextElementSibling.remove()
            }
            pageIndex = 0;

            let numOfPages = Math.ceil(data.length / MAXPERPAGE);

            for (let num = 0; num < numOfPages; num++) {
                let li = document.createElement('li');
                let a = document.createElement('a');

                li.id = "pageindex" + num;

                li.className = "page-item";
                a.className = "page-link";
                a.appendChild(document.createTextNode(num + 1));

                a.addEventListener("click", ev => {

                    let nextNode = previousButton;
                    while (!nextNode.nextElementSibling.isSameNode(nextButton)) {
                        nextNode.nextElementSibling.classList.remove("active");
                        nextNode = nextNode.nextElementSibling;
                    }

                    pageIndex = num;
                    li.classList.add("active");
                    build();
                })

                li.appendChild(a);
                nextButton.before(li);
            }

            nextButton.addEventListener("click", ev => {
                pageIndex = Math.min(pageIndex + 1, numOfPages - 1);
                let nextNode = previousButton;
                while (!nextNode.nextElementSibling.isSameNode(nextButton)) {
                    nextNode.nextElementSibling.classList.remove("active");
                    nextNode = nextNode.nextElementSibling;
                }
                document.getElementById("pageindex" + pageIndex).classList.toggle("active");
                build();
            });

            nextButton.previousElementSibling.addEventListener("click", ev => {
                nextButton.classList.toggle("disabled");
            });

            previousButton.addEventListener("click", ev => {
                pageIndex = Math.max(pageIndex - 1, 0);
                let nextNode = previousButton;
                while (!nextNode.nextElementSibling.isSameNode(nextButton)) {
                    nextNode.nextElementSibling.classList.remove("active");
                    nextNode = nextNode.nextElementSibling;
                }
                document.getElementById("pageindex" + pageIndex).classList.toggle("active");
                build();
            })

            previousButton.nextElementSibling.addEventListener("click", ev => {
                previousButton.classList.toggle("disabled");
            });

            previousButton.nextElementSibling.classList.add("active");

        } else {
            pagination.style.display = "none";
        }
    }

    return {
        addData: add,
        filter,
        onSort,
        reset
    }
}())

/**
 * Controller of filters
 */
const filterController = (function () {
    /**
     * Array with the filters
     */
    const filters = [];

    /**
     * Comunicates with data controller and passes the filters function
     */
    let filterDOM = function () {
        dataController.filter((job) => filters.every(filter => filter.fn(job)));
    }

    /**
     * Adds a filter
     * @param {{type: String, fn: Function}} obj Object with filter information
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
     * Removes a filter
     * @param {String} type Key with the type to be remove
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

/**
 * Creates the filters checkboxs
 * @param {String} id Id of the parent element where the checkbox with be created
 * @param {String} key Key on the obj pass
 * @param {String} title Title of the buttons
 * @param {[{ nome: String, descricao: String, area: String, duracao: Number,  valor: Number, validade: Date }]} jobs Array with jobs
 */
function createFilterButtons(id, key, title, jobs) {

    const parent = document.getElementById(id);
    const parentCollapse = document.getElementById(id + "Collapse");
    parent.innerHTML = `<h3>${title}</h3>`;
    parentCollapse.innerHTML = `<h3>${title}</h3>`;

    let arrControl = [];
    const datas = new Set(jobs.map(e => e[key]));

    for (const data of datas) {

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

    //Creates a instance of axios
    const api = axios.create({
        baseURL: window.location.origin,
        withCredentials: true,
    });

    const sliderValor = document.getElementById('sliderValor');
    const inputValor = document.getElementById('inputValor');
    const sliderValorCollapse = document.getElementById('sliderValorCollapse');
    const inputValorCollapse = document.getElementById('inputValor');

    //Adds a filter on filter controller
    function sliderFilter() {
        filterController.add({
            type: "valor",
            fn: (job) => job.valor >= sliderValor.value || job.valor >= inputValor.value
                || job.valor >= sliderValorCollapse.value || job.valor >= inputValorCollapse.value
        });
    }

    //if one slider moves update the others
    sliderValor.addEventListener("input", () => {
        inputValor.value = sliderValor.value;
        sliderValorCollapse.value = sliderValor.value;
        inputValorCollapse.value = sliderValor.value;
    });
    inputValor.addEventListener("input", () => {
        sliderValor.value = inputValor.value;
        sliderValorCollapse.value = inputValor.value;
        inputValorCollapse.value = inputValor.value;
    });
    sliderValorCollapse.addEventListener("input", () => {
        sliderValor.value = sliderValorCollapse.value;
        inputValor.value = sliderValorCollapse.value;
        inputValorCollapse.value = sliderValorCollapse.value;
    });
    inputValorCollapse.addEventListener("input", () => {
        sliderValor.value = inputValorCollapse.value;
        inputValor.value = inputValorCollapse.value;
        sliderValorCollapse.value = inputValorCollapse.value;
    });

    //Adds events for the filters
    sliderValor.addEventListener("change", sliderFilter);
    inputValor.addEventListener("change", sliderFilter);
    sliderValorCollapse.addEventListener("change", sliderFilter);
    inputValorCollapse.addEventListener("change", sliderFilter);

    api.get('/api/jobs').then(res => {
        if (typeof res.data === 'object') {
            dataController.addData(res.data.map(job => ({ ...job, validade: new Date(job.validade) })));

            //Sets the values for the sliders
            let arr = res.data.map(job => job.valor);
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

            createFilterButtons("areaFilter", "area", "Area", res.data);
            createFilterButtons("empresaFilter", "nome", "Empresas", res.data);
        }
    });
})

/**
 * Removes and adds the comparar tab on modal
 * @param {("open"|"close")} type the type of operation
 */
function compararButton(type) {
    let compararContainer = document.getElementById("comparar-container");

    if (type === "close") {
        compararContainer.style.display = "none";
        compararContainer.classList.remove("d-inline-flex");
    } if (type === "open") {
        compararContainer.classList.add("d-inline-flex");
    }
}