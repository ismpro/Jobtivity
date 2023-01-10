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
     * Const of the max cards per page
     */
    const MAXCOMPARATIONS = 3;
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
     * Array with the jobs for the compare
     */
    let compararArray = [];

    /**
     * Adds data to the controller. Only use this function in the begin.
     * @param {[{ nome: String, descricao: String, area: String, duracao: Number,  valor: Number, validade: Date }]} obj Array with jobs
     */
    let add = function (obj) {
        if (!dataOriginal.length) {
            data = obj;
            dataOriginal = JSON.parse(JSON.stringify(obj));
            data = data.map((job, index) => ({ ...job, id: index, validade: new Date(job.validade) }));
            dataOriginal = dataOriginal.map((job, index) => ({ ...job, id: index, validade: new Date(job.validade) }));
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
        pageIndex = 0;
        compararArray = [];
        let sort = JSON.parse(window.sessionStorage.getItem("sort"));
        if (sort) {
            data.sort((a, b) => sort.asc ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key])
        }
        compararContainerCloseOrOpen("close");
        buildDom();
    }

    /**
     * Sorts the content of the jobs.
     * @param {String} key Key of the jobs you want to sort by
     */
    let onSort = function (key) {
        pageIndex = 0;
        compararArray = [];
        compararContainerCloseOrOpen("close");
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
        const modal = document.querySelector(".modal-body.row");
        const compararInfo = document.getElementById("comparar-info");
        const selectedText = document.getElementById("selected-text");
        const buttonCompare = document.getElementById("button-compare");

        /**
         * Creates DOM for compare feature and its controles
         */
        let buildComparar = function () {

            let compararDivChecks = document.querySelectorAll("div.form-check.d-flex.d-xl-flex.justify-content-end");

            if (compararArray.length === MAXCOMPARATIONS) {
                compararDivChecks.forEach(div => {
                    if (!div.firstElementChild.checked) {
                        div.firstElementChild.disabled = true;
                    }
                })
            } else {
                compararDivChecks.forEach(div => {
                    div.firstElementChild.disabled = false;
                })
            }

            if (compararArray.length > 1) {
                buttonCompare.style.display = "block";
            } else {
                buttonCompare.style.display = "none";
            }

            compararContainerCloseOrOpen(compararArray.length > 0 ? "open" : "close")
            selectedText.textContent = `${compararArray.length} Ofertas selecionadas${compararArray.length < 2 ? ", precisas de pelo menos 2" : ""}`

            //Clears the divs for the new DOM
            while (compararInfo.hasChildNodes()) {
                compararInfo.firstChild.remove();
            }
            while (modal.hasChildNodes()) {
                modal.firstChild.remove();
            }

            compararArray.forEach(ele => {

                //Div below the page creation
                let div = document.createElement("div");
                let h4 = document.createElement("h4");
                let p = document.createElement("p");

                div.className = "col";

                h4.appendChild(document.createTextNode(ele.nome));
                p.appendChild(document.createTextNode(`${ele.area} - ${ele.valor}€`));
                div.appendChild(h4);
                div.appendChild(p);
                compararInfo.appendChild(div);

                //Modal dom creation
                let divModal = document.createElement("div");
                let h4Modal = document.createElement("h4");
                let pModal1 = document.createElement("p");
                let pModal2 = document.createElement("p");
                let pModal3 = document.createElement("p");
                let pModal4 = document.createElement("p");

                divModal.className = "col";
                h4Modal.appendChild(document.createTextNode(ele.nome));
                pModal1.appendChild(document.createTextNode(`${ele.valor}€`));
                pModal2.appendChild(document.createTextNode(ele.area));
                pModal3.appendChild(document.createTextNode(`For ${ele.duracao} months`));
                pModal4.appendChild(document.createTextNode(`Until ${ele.validade.toLocaleString().split(',')[0]}`));

                divModal.appendChild(h4Modal);
                divModal.appendChild(pModal1);
                divModal.appendChild(pModal2);
                divModal.appendChild(pModal3);
                divModal.appendChild(pModal4);
                modal.appendChild(divModal);
            });

            let canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: compararArray.map(ele => ele.nome),
                    datasets: [{
                        label: 'Salario',
                        data: compararArray.map(ele => ele.valor),
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
            modal.appendChild(canvas);
        }

        /**
         * Rebuilds the dom content
         */
        let build = function () {

            while (mainSection.hasChildNodes()) {
                mainSection.firstChild.remove();
            }

            data.slice(pageIndex * MAXPERPAGE, (pageIndex + 1) * MAXPERPAGE).forEach((element) => {
                const div = document.createElement("div");
                div.className = "jobContainer";

                let node_4 = document.createElement('DIV');
                node_4.setAttribute('class', 'row');
                div.appendChild(node_4);

                let node_5 = document.createElement('DIV');
                node_5.setAttribute('class', 'col');
                node_4.appendChild(node_5);

                let node_6 = document.createElement('H1');
                node_6.appendChild(document.createTextNode(element.nome));
                node_5.appendChild(node_6);

                let node_7 = document.createElement('DIV');
                node_7.setAttribute('class', 'col');
                node_4.appendChild(node_7);

                let node_8 = document.createElement('H3');
                node_8.setAttribute('style', 'text-align: right;');
                node_8.appendChild(document.createTextNode(element.area));
                node_7.appendChild(node_8);

                let node_9 = document.createElement('DIV');
                node_9.setAttribute('class', 'row');
                div.appendChild(node_9);

                let node_10 = document.createElement('DIV');
                node_10.setAttribute('class', 'col-xl-10');
                node_9.appendChild(node_10);

                let node_11 = document.createElement('P');
                node_11.setAttribute('style', 'width: 100%;min-width: 100px;text-align: left;overflow: scroll;overflow-y: auto;overflow-x: visible;max-height: 150px;');
                node_10.appendChild(node_11);

                let node_13 = document.createElement('SPAN');
                node_13.setAttribute('style', 'color: rgb(0, 0, 0);');
                node_13.appendChild(document.createTextNode(element.descricao));
                node_11.appendChild(node_13);

                let node_16 = document.createElement('DIV');
                node_16.setAttribute('class', 'col');
                node_16.setAttribute('style', 'width: 141.5px;');
                node_9.appendChild(node_16);

                let node_17 = document.createElement('P');
                node_17.setAttribute('class', 'd-xl-flex justify-content-xl-center align-items-xl-center');
                node_17.setAttribute('style', 'text-align: right;margin: 0px;height: 100%;');
                node_17.appendChild(document.createTextNode(element.valor + "€"));
                node_16.appendChild(node_17);

                let node_18 = document.createElement('DIV');
                node_18.setAttribute('class', 'row');
                div.appendChild(node_18);

                let node_19 = document.createElement('DIV');
                node_19.setAttribute('class', 'col');
                node_18.appendChild(node_19);

                let node_20 = document.createElement('P');
                node_20.setAttribute('class', 'd-xl-flex justify-content-xl-start align-items-xl-center');
                node_20.setAttribute('style', 'height: 100%;');
                node_19.appendChild(node_20);

                let node_22 = document.createElement('STRONG');
                node_20.appendChild(node_22);
                node_22.appendChild(document.createTextNode(`Contract for ${element.duracao} months`));

                let node_27 = document.createElement('DIV');
                node_27.setAttribute('class', 'col');
                node_18.appendChild(node_27);

                let node_28 = document.createElement('P');
                node_28.setAttribute('class', 'd-xl-flex justify-content-xl-end align-items-xl-center');
                node_28.setAttribute('style', 'text-align: right;height: 100%;');
                node_27.appendChild(node_28);

                let node_30 = document.createElement('STRONG');
                node_28.appendChild(node_30);
                node_30.appendChild(document.createTextNode(`Offer available until ${element.validade.toLocaleString().split(',')[0]}`));

                if (data.length > 2) {

                    let node_35 = document.createElement('DIV');
                    node_35.setAttribute('class', 'row');
                    div.appendChild(node_35);

                    let node_36 = document.createElement('DIV');
                    node_36.setAttribute('class', 'col');
                    node_35.appendChild(node_36);

                    let node_37 = document.createElement('DIV');
                    node_37.setAttribute('class', 'form-check d-flex d-xl-flex justify-content-end');
                    node_36.appendChild(node_37);

                    let input = document.createElement('input');
                    input.setAttribute('class', 'form-check-input');
                    input.setAttribute('type', 'checkbox');
                    input.setAttribute('id', `compararCheck${element.id}`);
                    input.setAttribute('style', 'margin-right: 10px;');
                    node_37.appendChild(input);

                    compararArray.forEach(cmp => {
                        if (cmp.id === element.id) {
                            input.checked = true;
                        }
                    })

                    if (compararArray.length == 3 && !input.checked) {
                        input.disabled = true;
                    }

                    input.addEventListener("click", function (ev) {
                        if (input.checked && compararArray.length < MAXCOMPARATIONS) {
                            compararArray.push(element)
                        } else {
                            let idx = compararArray.findIndex(comp => comp.id === element.id);
                            if (idx !== -1) compararArray.splice(idx, 1);
                        }
                        buildComparar();
                    });


                    let label = document.createElement('label');
                    label.setAttribute('class', 'form-check-label');
                    label.setAttribute('for', `compararCheck${element.id}`);
                    label.appendChild(document.createTextNode("Comparar"));
                    node_37.appendChild(label);

                }

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

    compararContainerCloseOrOpen("close");

    api.get('/api/jobs').then(res => {
        if (typeof res.data === 'object') {
            dataController.addData(res.data);

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
function compararContainerCloseOrOpen(type) {
    let compararContainer = document.getElementById("comparar-container");

    if (type === "close") {
        compararContainer.style.display = "none";
        compararContainer.classList.remove("d-inline-flex");
    } if (type === "open") {
        compararContainer.classList.add("d-inline-flex");
    }
}

