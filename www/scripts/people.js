"use strict";
let dataController = tableMaker("list-row", (element) => {

    let mainDiv = document.createElement("div");
    mainDiv.className = "col-12 col-md-6 col-lg-4";

    let professionalDiv = document.createElement("div");
    professionalDiv.className = "clean-product-item";

    let imgDiv = document.createElement("div");
    imgDiv.className = "text-center image";

    let img = document.createElement("img");
    img.src = "./images/avatar.png"

    let nameDiv = document.createElement("div");
    nameDiv.className = "product-name";

    let name = document.createElement("h5");
    name.className = "text-center";
    name.textContent = element.name;

    let iconDiv = document.createElement("div");
    iconDiv.className = "text-center";

    nameDiv.appendChild(name);
    imgDiv.appendChild(img);

    professionalDiv.appendChild(imgDiv);
    professionalDiv.appendChild(nameDiv);

    mainDiv.appendChild(professionalDiv);

    professionalDiv.addEventListener("click", ev => {
        window.location.href = `/profile?id=${element.idUser}`;
    })

    return mainDiv;
})

window.addEventListener("DOMContentLoaded", function () {
    api.get('/people/all').then(res => {
        if (res.status === 200 && typeof res.data === 'object') {
            console.log(res.data);
            dataController.addData(res.data);
        }
    });
});