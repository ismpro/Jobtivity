/**
 * TableMaker is a utility for creating and paginating a table using a provided DOM builder function.
 * It also provides methods for filtering and sorting the data.
 * @param {String} main - The ID of the element to be used as the parent container for the table.
 * @param {Function} domMaker - The function that creates the DOM elements for each item in the data. 
 */
function tableMaker(main, domMaker) {

    /**
     * Maximum number of items per page.
     */
    const MAXPERPAGE = 10;

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
            data = obj;
            dataOriginal = JSON.parse(JSON.stringify(obj));
            data = data.map((job, index) => ({ ...job, id: index, validade: new Date(job.validade) }));
            dataOriginal = dataOriginal.map((job, index) => ({ ...job, id: index, validade: new Date(job.validade) }));
            //Object.freeze(dataOriginal);

            let sort = JSON.parse(window.sessionStorage.getItem("sort" + main));
            if (sort) {
                document.getElementById(`${sort.key}Icon`).innerText = sort.asc ? "keyboard_arrow_up" : "keyboard_arrow_down";
                data.sort((a, b) => sort.asc ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key])
            }
            buildDom();
        }
    }

    /**
     * Filters the content of the data.
     * @param {function} fn The function for the filter
    */
    let filter = function (fn) {
        data = dataOriginal.filter(fn);
        let sort = JSON.parse(window.sessionStorage.getItem("sort" + main));
        if (sort) {
            data.sort((a, b) => sort.asc ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key])
        }
        pageIndex = 0;
        buildDom();
    }

    /**
     * Sorts the content of the data.
     * @param {string} key Key of the data you want to sort by
    */
    let onSort = function (key) {
        let sort = JSON.parse(window.sessionStorage.getItem("sort" + main));
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

        pageIndex = 0;
        window.sessionStorage.setItem("sort" + main, JSON.stringify(sort));
        buildDom();
    }

    let reset = function () {
        data = dataOriginal;
        let sort = JSON.parse(window.sessionStorage.getItem("sort" + main));
        if (sort) {
            document.getElementById(`${sort.key}Icon`).innerText = "";
        }
        window.sessionStorage.setItem("sort" + main, JSON.stringify({
            key: "",
            asc: false
        }));
        buildDom();
    }

    let buildDom = function () {

        const mainSection = document.getElementById(main);
        const nextButton = document.getElementById("nextButton");
        const previousButton = document.getElementById("previousButton");
        const pagination = document.querySelector(".pagination");

        let build = function () {

            while (mainSection.hasChildNodes()) {
                mainSection.firstChild.remove();
            }

            data.slice(pageIndex * MAXPERPAGE, (pageIndex + 1) * MAXPERPAGE).forEach((element, index) => {
                mainSection.appendChild(domMaker(element, index));
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
}