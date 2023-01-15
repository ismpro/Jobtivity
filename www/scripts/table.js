/**
 * TableMaker is a utility for creating and paginating a table using a provided DOM builder function.
 * It also provides methods for filtering and sorting the data.
 * @param {String} main - The ID of the element to be used as the parent container for the table.
 * @param {Function} domMaker - The function that creates the DOM elements for each item in the data.
 */
function tableMaker(main, domMaker, noDataText = "No data", MAXPERPAGE = 10) {

    /**
     * Data used for creating the table.
     */
    let data = [];

    /**
     * Copy of original data without modifications.
     */
    let dataOriginal = [];

    /**
     * Current page index.
     */
    let pageIndex = 0;

    /**
     * Adds data to the controller. Only use this function in the begin.
     * @param {Object[]} obj Array with jobs
     */
    let add = function (obj) {
        if (!dataOriginal.length) {
            data = obj; // Assign the received data to the data array
            dataOriginal = JSON.parse(JSON.stringify(obj)); // Creating a copy of the original data
            data = data.map((job, index) => ({ ...job, id: index, validade: new Date(job.validade) }));
            dataOriginal = dataOriginal.map((job, index) => ({ ...job, id: index, validade: new Date(job.validade) }));

            // Getting the sort state from session storage
            let sort = JSON.parse(window.sessionStorage.getItem("sort" + main));
            if (sort) {
                document.getElementById(`${sort.key}Icon`).innerText = sort.asc ? "keyboard_arrow_up" : "keyboard_arrow_down"; // Updating the sort icon
                data.sort((a, b) => sort.asc ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key]) // Sort the data
            }
            buildDom(); // Build the table
        }
    }

    /**
     * Removes a element from data
     * @param {Number} id Id of the element for remove
     */
    let remove = function (id) {
        if (!(id === void 0)) {
            let indexData = data.findIndex(ele => ele.id === id);
            let indexDataOriginal = dataOriginal.findIndex(ele => ele.id === id);

            if (indexData !== -1) data.splice(indexData, 1); // Removing the element from data array
            if (indexDataOriginal !== -1) dataOriginal.splice(indexDataOriginal, 1); // Removing the element from original data array
            buildDom(); // Rebuild the table
        }
    }

    /**
     * Filters the content of the data.
     * @param {Function} fn The function for the filter
    */
    let filter = function (fn) {
        data = dataOriginal.filter(fn); // Filtering the data array
        let sort = JSON.parse(window.sessionStorage.getItem("sort" + main));
        if (sort) {
            data.sort((a, b) => sort.asc ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key]) // Sort the filtered data
        }
        pageIndex = 0; // Reset the page index
        buildDom(); // Rebuild the table
    }

    /**
     * Sorts the content of the data.
     * @param {String} key Key of the data you want to sort by
    */
    let onSort = function (key) {
        let sort = JSON.parse(window.sessionStorage.getItem("sort" + main)); // Getting the sort state from session storage
        if (!sort) sort = {
            key: "",
            asc: false
        };
        if (sort.key === key) { // If the current key is the same as the key to sort by
            sort.asc = !sort.asc; // Toggle the sort order
            document.getElementById(`${sort.key}Icon`).innerText = sort.asc ? "keyboard_arrow_up" : "keyboard_arrow_down"; // Update the sort icon
        } else {
            if (sort.key) document.getElementById(`${sort.key}Icon`).innerText = ""; // Clear the previous sort icon
            document.getElementById(`${key}Icon`).innerText = "keyboard_arrow_down"; // Update the sort icon
            sort.key = key; 
            sort.asc = false;
        }
        data.sort((a, b) => sort.asc ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key])

        pageIndex = 0;
        window.sessionStorage.setItem("sort" + main, JSON.stringify(sort));
        buildDom();
    }

    /**
     * Resets the table by removing all filters and sorting, and returning to the first page.
     */
    let reset = function () { 
        data = dataOriginal; // reset data to the original data
        let sort = JSON.parse(window.sessionStorage.getItem("sort" + main));
        if (sort) {
            document.getElementById(`${sort.key}Icon`).innerText = ""; // Clear the previous sort icon
        }
        window.sessionStorage.setItem("sort" + main, JSON.stringify({
            key: "",
            asc: false
        }));
        pageIndex = 0; // Reset the page index
        buildDom(); // Rebuild the table
    }

    /**
     * Builds the table by calling the provided DOM builder function and paginating the data.
     */
    let buildDom = function () {

        const mainSection = document.getElementById(main);
        const nextButton = document.getElementById("nextButton");
        const previousButton = document.getElementById("previousButton");
        const pagination = document.querySelector(".pagination");

        //Build table content using DOM builder function
        let build = function () {

            //Delete the childs of the main section
            while (mainSection.hasChildNodes()) {
                mainSection.firstChild.remove();
            }

            if(data.length) {
                //Builds the page with the data and using the DOM builder function
                data.slice(pageIndex * MAXPERPAGE, (pageIndex + 1) * MAXPERPAGE).forEach((element, index) => {
                    mainSection.appendChild(domMaker(element, index));
                });
            } else {
                //If the data array is empty create a text using the noDataText parameter
                let p = document.createElement("p");
                p.classList.add("text-center");
                p.appendChild(document.createTextNode(noDataText));

                mainSection.appendChild(p);
            }
        }

        //Calls for the build function
        build();

        if (data.length > MAXPERPAGE) {

            pagination.style.display = "flex";

            //Deletes all numbers on the paganition
            while (!previousButton.nextElementSibling.isSameNode(nextButton)) {
                previousButton.nextElementSibling.remove()
            }
            pageIndex = 0;

            //Calculates the number of pages needed
            let numOfPages = Math.ceil(data.length / MAXPERPAGE);

            //Creates all the buttons for the pagination and theirs event on click
            for (let num = 0; num < numOfPages; num++) {
                let li = document.createElement('li');
                let a = document.createElement('a');

                li.id = "pageindex" + num;

                li.className = "page-item";
                a.className = "page-link";
                a.appendChild(document.createTextNode(num + 1));

                //event listener for button click
                a.addEventListener("click", ev => {

                    let nextNode = previousButton;
                    while (!nextNode.nextElementSibling.isSameNode(nextButton)) {
                        nextNode.nextElementSibling.classList.remove("active");
                        nextNode = nextNode.nextElementSibling;
                    }

                    //update the current page index and add active class to the current button
                    pageIndex = num;
                    li.classList.add("active");
                    build();
                })

                li.appendChild(a);
                nextButton.before(li);
            }

            //event listener for next button click
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

            //
            nextButton.previousElementSibling.addEventListener("click", ev => {
                nextButton.classList.toggle("disabled");
            });

            //event listener for previous button click
            previousButton.addEventListener("click", ev => {
                //decrement the current page index
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
            //hide pagination container if the pagination is not needed
            pagination.style.display = "none";
        }
    }

    return {
        addData: add,
        filter,
        onSort,
        reset,
        remove
    }
}