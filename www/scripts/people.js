"use strict";

const dataController = (function(){

    let data = [];

    let add = function (obj){
        data = obj;
        buildDom();
    }

    let buildDom = function(){
        for(let dados of data){
            let row = document.getElementById("list-row");

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
            name.textContent = dados.name;

            let iconDiv = document.createElement("div");
            iconDiv.className = "text-center";
            
            nameDiv.appendChild(name);
            imgDiv.appendChild(img);
            
            professionalDiv.appendChild(imgDiv);
            professionalDiv.appendChild(nameDiv);
            
            mainDiv.appendChild(professionalDiv);
            row.appendChild(mainDiv);

            professionalDiv.addEventListener("click", ev => {
                window.location.href = `/profile?id=${dados.idUser}`;
            }) 
            
            console.log(dados);
        }
        
        
    }

    return{
        addData: add
    }

}());


window.addEventListener("DOMContentLoaded", function () {
    api.get('/people/all').then(res => {
        if (res.status === 200 && typeof res.data === 'object') {
            console.log(res.data);
            dataController.addData(res.data);
        }
    });
});