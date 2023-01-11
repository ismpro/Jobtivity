let dataController = tableMaker("companies", (element) => {

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
    button1.onclick = function () {
        api.post('/admin/alterValid', {
            id: element.idCompany,
            type: "accept"
        }).then(res => {
            if (res.status === 200) {
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

    return div;
});

window.addEventListener("DOMContentLoaded", function () {
    api.get('/admin/list').then(res => {
        console.log(res.data);
        if (res.status === 200 && typeof res.data === 'object') {
            console.log(res.data)
            dataController.addData(res.data);
        }
    });
})