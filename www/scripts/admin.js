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

    const removeElement = (id) => {
        let indexData = data.findIndex(ele => ele.id === id);
        let indexDataOriginal = dataOriginal.findIndex(ele => ele.id === id);

        if(indexData !== -1) data.splice(indexData, 1);
        if (indexDataOriginal !== -1)  dataOriginal.splice(indexDataOriginal, 1);
    }

    /**
     * Adds data to the controller. Only use this function in the begin.
     * @param {{ idCompany: Number, name: String, description: String, logo: String, url: String }[]} obj Array with company
     */
    let add = function (obj) {
        if (!dataOriginal.length) {
            data = obj;
            dataOriginal = JSON.parse(JSON.stringify(obj));
            data = data.map((company, index) => ({ ...company, id: index }));
            dataOriginal = dataOriginal.map((company, index) => ({ ...company, id: index }));
            //Object.freeze(dataOriginal);

            let sort = JSON.parse(window.sessionStorage.getItem("sort"));
            if (sort) {
                document.getElementById(`${sort.key}Icon`).innerText = sort.asc ? "keyboard_arrow_up" : "keyboard_arrow_down";
                data.sort((a, b) => sort.asc ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key])
            }

            buildDom();
        }
    }
    /**
     * Sorts the content of the jobs.
     * @param {String} key Key of the jobs you want to sort by
     */
    let onSort = function (key) {
        pageIndex = 0;
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
     * Private function to build or rebuild the dom with jobs
     */
    let buildDom = function () {

        const mainSection = document.getElementById("companies");
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

            data.slice(pageIndex * MAXPERPAGE, (pageIndex + 1) * MAXPERPAGE).forEach((element) => {
                const div = document.createElement('div');
                div.style.boxShadow = '7px 7px 10px var(--bs-gray-700)';
                div.style.margin = '30px';

                const h1 = document.createElement('h1');
                h1.style.width = '100%';
                h1.style.marginLeft = '40px';
                h1.style.marginTop = '24px';
                h1.textContent = element.name;

                const row = document.createElement('div');
                row.classList.add('row');
                row.style.borderStyle = 'none';

                const col1 = document.createElement('div');
                col1.classList.add('col');
                col1.classList.add('d-xl-flex');
                col1.classList.add('align-self-center');
                col1.classList.add('justify-content-xl-center');

                const img = document.createElement('img');
                img.src = element.logo;
                img.height = 200;
                img.width = 200;
                col1.appendChild(img);

                const col2 = document.createElement('div');
                col2.classList.add('col-xl-7');

                const p = document.createElement('p');
                p.style.width = '100%';
                p.style.minWidth = '100px';
                p.style.textAlign = 'left';
                p.style.overflow = 'scroll';
                p.style.overflowY = 'auto';
                p.style.overflowX = 'visible';
                p.style.maxHeight = '150px';
                p.style.color = 'rgb(0, 0, 0)';
                p.textContent = element.description;
                col2.appendChild(p);

                const col3 = document.createElement('div');
                col3.classList.add('col');
                col3.classList.add('align-self-center');
                col3.style.width = '141.5px';

                const group = document.createElement('div');
                group.classList.add('btn-group');
                group.setAttribute('role', 'group');

                const button1 = document.createElement('button');
                button1.classList.add('btn');
                button1.classList.add('btn-primary');
                button1.textContent = 'Aceitar';
                button1.onclick = function() {
                    api.post('/admin/alterValid', {
                        id: element.idCompany,
                        type: "accept"
                    }).then(res => {
                        if(res.status === 200) {
                            removeElement(element.id);
                            buildDom();
                        }
                    })
                }

                const button2 = document.createElement('button');
                button2.classList.add('btn');
                button2.classList.add('btn-primary');
                button2.style.background = 'var(--bs-red)';
                button2.textContent = 'Rejeitar';
                button2.onclick = function () {
                    api.post('/admin/alterValid', {
                        id: element.idCompany,
                        type: "reject"
                    }).then(res => {
                        if (res.status === 200) {
                            removeElement(element.id);
                            buildDom();
                        }
                    })
                }

                group.appendChild(button1);
                group.appendChild(button2);
                col3.appendChild(group);

                row.appendChild(col1);
                row.appendChild(col2);
                row.appendChild(col3);

                div.appendChild(h1);
                div.appendChild(row);

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
        onSort
    }
}())


window.addEventListener("DOMContentLoaded", function () {
    api.get('/admin/list').then(res => {
        console.log(res.data);
        if (res.status === 200 && typeof res.data === 'object') {
            console.log(res.data)
            dataController.addData(res.data);
        }
    });
})