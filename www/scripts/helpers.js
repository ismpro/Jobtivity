/**
 * Creates a filter slider with an associated range filter for use in filtering jobs.
 *
 * @param {String} id - The id of the parent element in which to create the filter slider.
 * @param {String} nome - The name of the filter.
 * @param {Number} min - The minimum value of the range.
 * @param {Number} max - The maximum value of the range.
 * @param {Function} sliderFn - The function that the filter should use to determine if a job should be included or excluded.
 *
 */
function createFilterSliders(id, nome, min, max, sliderFn) {

    const parent = document.getElementById(id);
    const parentCollapse = document.getElementById(id + "Collapse");

    let h3 = document.createElement('h3');
    let sliderValor = document.createElement('input');
    let inputValor = document.createElement('input');

    h3.appendChild(document.createTextNode(nome));

    sliderValor.classList.add("form-range");
    sliderValor.type = "range";

    inputValor.classList.add("border", "rounded", 'form-control-sm')
    inputValor.type = "number";
    inputValor.style.width = "100%";

    let h3Collapse = document.createElement('h3');
    let sliderValorCollapse = document.createElement('input');
    let inputValorCollapse = document.createElement('input');

    h3Collapse.appendChild(document.createTextNode(nome));

    sliderValorCollapse.classList.add("form-range");
    sliderValorCollapse.type = "range";

    inputValorCollapse.classList.add("border", "rounded", 'form-control-sm')
    inputValorCollapse.type = "number";
    inputValorCollapse.style.width = "100%";

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

    //Adds a filter on filter controller
    var sliderFilter = function () {
        filterController.add({
            type: id,
            fn: (job) => sliderFn(job) >= sliderValor.value || sliderFn(job) >= inputValor.value
                || sliderFn(job) >= sliderValorCollapse.value || sliderFn(job) >= inputValorCollapse.value
        });
    }

    //Adds events for the filters
    sliderValor.addEventListener("change", sliderFilter);
    inputValor.addEventListener("change", sliderFilter);
    sliderValorCollapse.addEventListener("change", sliderFilter);
    inputValorCollapse.addEventListener("change", sliderFilter);

    parent.appendChild(h3);
    parent.appendChild(sliderValor);
    parent.appendChild(inputValor);

    parentCollapse.appendChild(h3Collapse);
    parentCollapse.appendChild(sliderValorCollapse);
    parentCollapse.appendChild(inputValorCollapse);
}

/**
 * This function creates checkboxes and appends them to elements in the DOM with specified ids
 * @function
 * @param {String} id - The id of the DOM element to which the checkboxes will be appended
 * @param {String} key - The property of the objects in the "jobs" parameter to use as the label for the checkboxes
 * @param {String} title - The title to be displayed above the checkboxes
 * @param {Object[]} data - An array of objects containing data to be used to create the checkboxes
 */
function createFilterCheckboxes(id, key, title, data) {

    // Find the element in the DOM with the id passed in the "id" parameter
    const parent = document.getElementById(id);
    const parentCollapse = document.getElementById(id + "Collapse");
    // Append a h3 tag containing the title passed in the "title" parameter
    parent.innerHTML = `<h3>${title}</h3>`;
    parentCollapse.innerHTML = `<h3>${title}</h3>`;

    let arrControl = [];
    // Create a new set of unique values of the property defined in the "key" parameter
    const datas = new Set(data.map(e => e[key]));

    // Iterate over the unique values
    for (const data of datas) {

        // Create elements for the checkbox and label
        let div = document.createElement("div");
        let input = document.createElement("input");
        let label = document.createElement("label");

        // Add class to the div
        div.className = "form-check";

        // Add class and properties to the input
        input.className = "form-check-input";
        input.type = "checkbox";
        input.id = "formCheck-" + data;

        // Add class and properties to the label
        label.className = "form-check-label";
        label.htmlFor = "formCheck-" + data;
        label.appendChild(document.createTextNode(data));

        // Create elements for the checkbox and label for the Collapse
        let divCollapse = document.createElement("div");
        let inputCollapse = document.createElement("input");
        let labelCollapse = document.createElement("label");

        // Add class to the div
        divCollapse.className = "form-check";

        // Add class and properties to the input
        inputCollapse.className = "form-check-input";
        inputCollapse.type = "checkbox";
        inputCollapse.id = "formCheck-" + data;

        // Add class and properties to the label
        labelCollapse.className = "form-check-label";
        labelCollapse.htmlFor = "formCheck-" + data;
        labelCollapse.appendChild(document.createTextNode(data));

        /**
         *  this callback is used to push or remove the filter based on the checkbox state
         * @callback eventClicker
         * @param {Boolean} bool -  boolean indicating the checkbox state
         */
        const eventClicker = (bool) => {
            // If the checkbox is checked
            if (bool) {
                // Push the value onto the array
                arrControl.push(data);
            } else {
                // Remove the value from the array
                arrControl.splice(arrControl.findIndex(ele => data === ele), 1);
            }

            // Check if any checkbox is selected, if not remove the filter, otherwise add it
            if (!arrControl.length) {
                filterController.remove(key);
            } else {
                filterController.add({
                    type: key,
                    fn: (data) => arrControl.includes(data[key])
                });
            }
        }

        //Add click event listener to the checkbox, if it changes, it changes the state of the other checkbox and runs the eventClicker callback
        input.addEventListener("click", (e) => {
            inputCollapse.checked = input.checked;
            eventClicker(input.checked);
        })
        inputCollapse.addEventListener("click", (e) => {
            input.checked = inputCollapse.checked;
            eventClicker(inputCollapse.checked);
        })

        // Append the checkbox and label to the Collapse parent
        divCollapse.appendChild(labelCollapse);
        divCollapse.appendChild(inputCollapse);
        parentCollapse.appendChild(divCollapse);

        // Append the checkbox and label to the parent
        div.appendChild(label);
        div.appendChild(input);
        parent.appendChild(div);
    }

}

/**
 * createContainer function creates an HTML element of type `type` and adds a class of `className`
 * @param {String} type - The type of element to be created (i.e. 'div', 'h1', 'p')
 * @param {String} className - The class name to be added to the element
 * @returns {HTMLElement} - The created container element
 */
function createContainer(type, className) {
    const container = document.createElement(type);
    container.className = className;
    return container;
}

/**
 * createRow function creates an HTML div element with class 'row'
 * @returns {HTMLElement} - The created row element
 */
function createRow() {
    return createContainer('div', 'row');
}

/**
 * createCol function creates an HTML div element with class 'col' or 
 * the class passed in colType parameter
 * @param {String} colType - The class name to be added to the col element, default is 'col'
 * @returns {HTMLElement} - The created col element
 */
function createCol(colType = 'col') {
    return createContainer('div', colType);
}

/**
 * createHeading function creates an HTML heading element of level `level` and with text content `text` 
 * if align is passed align text to this value
 * @param {Number} level - The heading level (i.e. 1, 2, 3)
 * @param {String} text - The text content of the heading
 * @param {String} align - The align of the text , default is empty string
 * @returns {HTMLElement} - The created heading element
 */
function createHeading(level, text, align = '') {
    const heading = document.createElement(`h${level}`);
    heading.appendChild(document.createTextNode(text));
    if (align) heading.style.textAlign = align;
    return heading;
}

/**
 * createHeading function creates an HTML heading element of level `level` and with text content `text` 
 * if align is passed align text to this value
 * @param {Number} level - The heading level (i.e. 1, 2, 3)
 * @param {String} text - The text content of the heading
 * @param {String} align - The align of the text , default is empty string
 * @returns {HTMLElement} - The created heading element
 */
function createParagraph(text, align = '', classes = []) {
    const paragraph = document.createElement('p');
    paragraph.appendChild(document.createTextNode(text));
    if (align) paragraph.style.textAlign = align;
    if (classes.length) classes.forEach(c => paragraph.classList.add(c));
    return paragraph;
}

/**
 * createSpan function creates an HTML span element with text content text
 * if color is passed set the text color to this value
 * @param {String} text - The text content of the span
 * @param {String} color - The text color of the span , default is empty string
 * @returns {HTMLElement} - The created span element
 */
function createSpan(text, color = '') {
    const span = document.createElement('span');
    span.appendChild(document.createTextNode(text));
    if (color) span.style.color = color;
    return span;
}

/**
 * createStrong function creates an HTML strong element with text content text
 * @param {String} text - The text content of the strong
 * @returns {HTMLElement} - The created strong element
 */
function createStrong(text) {
    const strong = document.createElement('strong');
    strong.appendChild(document.createTextNode(text));
    return strong;
}

/**
 * createCheckbox function creates an input checkbox and it's associated label
 * the id parameter passed is used as the id of both input and label
 * @param {String} id - The id of the input checkbox and it's label
 * @returns {HTMLElement} - The created div element containing the checkbox and it's label
 */
function createCheckbox(id, fn) {
    const div = createContainer('div', 'form-check d-flex d-xl-flex justify-content-end');

    const input = document.createElement('input');
    input.classList.add('form-check-input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', id);
    input.style.marginRight = '10px';

    fn(input);
    
    const label = document.createElement('label');
    label.classList.add('form-check-label');
    label.setAttribute('for', id);
    label.textContent = 'Comparar';
    div.appendChild(input);
    div.appendChild(label);

    return div;
}