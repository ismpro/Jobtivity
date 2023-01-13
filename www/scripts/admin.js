"use strict";

// Create dataController function to create company card element
let dataController = tableMaker("companies", (element) => {

    // Create main container div
    const div = document.createElement('div');
    div.style.boxShadow = '7px 7px 10px var(--bs-gray-700)';
    div.style.margin = '30px';

    // Create name element
    const h1 = document.createElement('h1');
    h1.style.width = '100%';
    h1.style.marginLeft = '40px';
    h1.style.marginTop = '24px';
    h1.textContent = element.name;

    // Create row container div
    const row = document.createElement('div');
    row.classList.add('row');
    row.style.borderStyle = 'none';

    // Create image container div
    const col1 = document.createElement('div');
    col1.classList.add('col');
    col1.classList.add('d-xl-flex');
    col1.classList.add('align-self-center');
    col1.classList.add('justify-content-xl-center');

    // Create image element
    const img = document.createElement('img');
    img.src = element.logo;
    img.height = 200;
    img.width = 200;
    col1.appendChild(img);

    // Create description container div
    const col2 = document.createElement('div');
    col2.classList.add('col-xl-7');

    // Create description element
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

    // Create buttons container div
    const col3 = document.createElement('div');
    col3.classList.add('col');
    col3.classList.add('align-self-center');
    col3.style.width = '141.5px';

    // Create button group div
    const group = document.createElement('div');
    group.classList.add('btn-group');
    group.setAttribute('role', 'group');

    // Create accept button
    const button1 = document.createElement('button');
    button1.classList.add('btn');
    button1.classList.add('btn-primary');
    button1.textContent = 'Accept';
    button1.onclick = function () {
        // Send accept request to API
        api.post('/admin/alterValid', {
            id: element.idCompany,
            type: "accept"
        }).then(res => {
            if (res.status === 200) {
                // Remove element and rebuild DOM
                removeElement(element.id);
                buildDom();
            }
        })
    }

    // Create reject button
    const button2 = document.createElement('button');
    button2.classList.add('btn');
    button2.classList.add('btn-primary');
    button2.style.background = 'var(--bs-red)';
    button2.textContent = 'Reject';
    button2.onclick = function () {
        // Send reject request to API
        api.post('/admin/alterValid', {
            id: element.idCompany,
            type: "reject"
        }).then(res => {
            if (res.status === 200) {
                // Remove element and rebuild DOM
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

    return div;
});

// DOMContentLoaded event listener
window.addEventListener("DOMContentLoaded", function () {
    // Send GET request to API to retrieve data
    api.get('/admin/list').then(res => {
        if (res.status === 200 && typeof res.data === 'object') {
            // Add data to table
            dataController.addData(res.data);
        }
    });
})