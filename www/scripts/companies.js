let dataController = tableMaker("companies", (element) => {

    // Create main container div
    const div = document.createElement('div');
    div.style.boxShadow = '7px 7px 10px var(--bs-gray-700)';
    div.style.margin = '30px';
    div.style.padding = '15px';

    // Create name element
    const h1 = document.createElement('h2');
    h1.style.width = '100%';
    h1.style.marginTop = '10px';
    h1.style.marginBottom = '20px';
    h1.style.fontWeight = 'bold';
    h1.style.color = '#3e588f';
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

    // Create image element
    const img = document.createElement('img');
    img.src = element.logo;
    img.height = 200;
    img.width = 250;
    img.style.borderRadius = "10px"
    col1.appendChild(img);

    // Create description container div
    const col2 = document.createElement('div');
    col2.classList.add('col-xl-7');
    col2.style.width = "75%"
    

    // Create description element
    const h3Desc = document.createElement('h4');
    h3Desc.style.fontWeight = 'bold';
    h3Desc.style.color = '#3e588f';
    h3Desc.textContent = "About";
    const p = document.createElement('p');
    p.appendChild(document.createElement('br'))
    p.style.width = '100%';
    p.style.minWidth = '100px';
    p.style.textAlign = 'left';
    p.style.overflow = 'scroll';
    p.style.overflowY = 'auto';
    p.style.overflowX = 'visible';
    p.style.maxHeight = '150px';
    p.style.color = 'rgb(0, 0, 0)';
    p.appendChild(document.createTextNode(element.description));

    


    // Create url element
    const a = document.createElement('a');
    a.appendChild(document.createElement('br'))
    a.style.width = '100%';
    a.style.minWidth = '100px';
    a.style.textAlign = 'left';
    a.style.overflow = 'scroll';
    a.style.overflowY = 'auto';
    a.style.overflowX = 'visible';
    a.style.maxHeight = '150px';
    a.style.color = 'rgb(0, 0, 0)';
    a.href = element.url;
    a.appendChild(document.createTextNode(element.url.substring(8)));
    
    col2.appendChild(h3Desc);
    col2.appendChild(p);
    col2.appendChild(a);

    row.appendChild(col1);
    row.appendChild(col2);
 

    div.appendChild(h1);
    div.appendChild(row);

    return div;
}, "No companies registered", 3);


// DOMContentLoaded event listener
window.addEventListener("DOMContentLoaded", function () {
    // Send GET request to API to retrieve data
    api.get('/companies/list').then(res => {
        if (res.status === 200 && typeof res.data === 'object') {
            // Add data to table
            dataController.addData(res.data);
        }
    });
})