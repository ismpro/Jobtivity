"use strict";

/**
 * compararController is an IIFE that keeps track of a list of jobs 
 * that will be compared and it has several methods to handle the compararArray
 * @module compararController
 */
let compararController = (function () {
    /**
     * Const of the max cards per page
     */
    const MAXCOMPARATIONS = 3;
    /**
     * Array with the jobs for the compare
     */
    let compararArray = [];

    /**
     * add function add a new job object in the compararArray 
     * and calls the buildComparar function
     * @param {Object} obj - an object with job data
     */
    let add = function (obj) {
        let comparar = compararArray.find(cmp => cmp.id === obj.id)
        if (comparar) {
            comparar.element = obj.element;
        } else {
            compararArray.push(obj)
        }
        buildComparar();
    }

    /**
     * remove function removes an object from the compararArray by its id
     * and calls the buildComparar function
     * @param {String} id - the id of the job
     */
    let remove = function (id) {
        let index = compararArray.findIndex(cmp => cmp.id === id);
        if (index === -1) return;
        compararArray.splice(index, 1);
        buildComparar();
    }

    /**
     * checkMax function check if the compararArray is less than the max number of elements allowed
     * @returns {Boolean} - true if compararArray is less than MAXCOMPARATIONS
     */
    let checkMax = function () {
        return compararArray.length < MAXCOMPARATIONS
    }

    /**
     * check function check if an element with the given id is already in the compararArray
     * and check if the compararArray has reached its maximum
     * @param {HTMLElement} input - an input element
     * @param {String} id - the id of the job
     */
    let check = function (input, id) {
        compararArray.forEach(cmp => {
            if (cmp.id === id) {
                input.checked = true;
            }
        })

        if (compararArray.length == 3 && !input.checked) {
            input.disabled = true;
        }
    }

    /**
     * reset function empty the compararArray and calls the buildComparar function
     */
    let reset = function () {
        compararArray = [];
        buildComparar();
    }

    /**
     * buildComparar function creates a DOM for the compare feature, update the UI elements 
     * and displaying the number of selected jobs and calls the compararContainerCloseOrOpen function
     * with a string parameter "open" or "close" depending on the number of jobs selected.
     */
    let buildComparar = function () {

        const modal = document.querySelector(".modal-body.row");
        const compararInfo = document.getElementById("comparar-info");
        const selectedText = document.getElementById("selected-text");
        const buttonCompare = document.getElementById("button-compare");

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

        // open or close the comparar container
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

            let element = ele.element

            //Div below the page creation
            let div = document.createElement("div");
            let h4 = document.createElement("h4");
            let p = document.createElement("p");

            div.className = "col";

            h4.appendChild(document.createTextNode(element.nome));
            p.appendChild(document.createTextNode(`${element.area} - ${element.valor}€`));
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
            h4Modal.appendChild(document.createTextNode(element.nome));
            pModal1.appendChild(document.createTextNode(`${element.valor}€`));
            pModal2.appendChild(document.createTextNode(element.area));
            pModal3.appendChild(document.createTextNode(`For ${element.duracao} months`));
            pModal4.appendChild(document.createTextNode(`Until ${element.validade.toLocaleString().split(',')[0]}`));

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
                labels: compararArray.map(ele => ele.element.nome),
                datasets: [{
                    label: 'Salario',
                    data: compararArray.map(ele => ele.element.valor),
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

    return {
        add,
        remove,
        check,
        checkMax,
        reset
    }
}())

let dataController = tableMaker("section_jobs", (element) => {

    // Create the main container element
    const jobContainer = createContainer('div', 'jobContainer');

    // Create the first row element, and it's cols
    const row1 = createRow();
    const col1 = createCol();

    const h1 = createHeading(1, element.nome);
    col1.appendChild(h1);

    const col2 = createCol();
    const h3 = createHeading(3, element.area, 'right');
    col2.appendChild(h3);
    row1.appendChild(col1);
    row1.appendChild(col2);

    // Create the second row element, and it's cols
    const row2 = createRow();
    const col3 = createCol('col-xl-10');

    const p1 = document.createElement('p');
    p1.style = 'width: 100%;min-width: 100px;text-align: left;overflow: scroll;overflow-y: auto;overflow-x: visible;max-height: 150px;color: rgb(0, 0, 0);'
    p1.appendChild(document.createTextNode(element.descricao));

    col3.appendChild(p1);
    const col4 = createCol();
    col4.style.width = '141.5px';
    const p2 = createParagraph((element.valor * element.duracao) + "€", 'right', ['d-xl-flex', 'justify-content-xl-center', 'align-items-xl-center']);
    col4.appendChild(p2);
    row2.appendChild(col3);
    row2.appendChild(col4);

    // Create the third row element, and it's cols
    const row3 = createRow();
    const col5 = createCol();
    const p3 = createParagraph('', '', ['d-xl-flex', 'justify-content-xl-start', 'align-items-xl-center']);
    const strong1 = createStrong(`Contract for ${element.duracao} months`);
    p3.appendChild(strong1);
    col5.appendChild(p3);
    const col6 = createCol();
    const p4 = createParagraph('', 'right', ['d-xl-flex', 'justify-content-xl-end', 'align-items-xl-center']);
    const strong2 = createStrong(`Offer available until ${element.validade.toLocaleString().split(',')[0]}`);
    p4.appendChild(strong2);
    col6.appendChild(p4);
    row3.appendChild(col5);
    row3.appendChild(col6);

    // Create the forth row element, and it's cols
    const row4 = createRow();
    const col7 = createCol();
    const checkbox = createCheckbox('compararCheck33', (input => {
        compararController.check(input, element.id);

        input.addEventListener("click", function (ev) {
            if (input.checked && compararController.checkMax()) {
                compararController.add({
                    id: element.id,
                    element: element
                })
            } else {
                compararController.remove(element.id);
            }
        });
    }));
    col7.appendChild(checkbox);
    row4.appendChild(col7);

    jobContainer.appendChild(row1);
    jobContainer.appendChild(row2);
    jobContainer.appendChild(row3);
    jobContainer.appendChild(row4);

    return jobContainer;
}, "No jobs");

/**
 * onSort function handles the sort event of a specific type
 * This function will close the compararContainer, reset compararController and 
 * call the onSort function of dataController
 * @param {string} type - The type of sort that is being performed
 */
function onSort(type) {
    compararContainerCloseOrOpen("close");
    compararController.reset();
    dataController.onSort(type);
}

/**
 * FilterController is a module for managing filters for filter data.
 *
 * @module FilterController
 * 
 * @property {Array} filters - An array with the filters.
 * @property {function} filterDOM - Comunicates with data controller and passes the filters function.
 * @property {function} addFilter - Adds a filter.
 * @property {function} removeFilter - Removes a filter.
 *
 * @function add - Adds a filter.
 * @function remove - Removes a filter.
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
        compararController.reset();
        compararContainerCloseOrOpen("close");
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

window.addEventListener("DOMContentLoaded", function () {

    compararContainerCloseOrOpen("close");

    api.get('/api/jobs').then(res => {
        if (typeof res.data === 'object') {
            dataController.addData(res.data);

            //Sets the values for the sliders
            let arrValor = res.data.map(job => (job.valor * job.duracao));
            let arrDuracao = res.data.map(job => job.duracao);

            createFilterSliders("duracaoFilter", "Duração minima", Math.min(...arrDuracao), Math.max(...arrDuracao), (job) => job.duracao);
            createFilterSliders("valorFilter", "Valor minima", Math.min(...arrValor), Math.max(...arrValor), (job) => (job.valor * job.duracao));

            createFilterCheckboxes("areaFilter", "area", "Area", res.data);
            createFilterCheckboxes("empresaFilter", "nome", "Empresas", res.data);
        }
    });
})