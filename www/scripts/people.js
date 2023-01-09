"use strict";

const api = axios.create({
    baseURL: window.location.origin,
    withCredentials: true,
});

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

            let icon = document.createElement("i");
            icon.className = "material-icons";
            icon.textContent = "perm_contact_calendar";

            
            nameDiv.appendChild(name);
            imgDiv.appendChild(img);
            iconDiv.appendChild(icon);
            
            professionalDiv.appendChild(imgDiv);
            professionalDiv.appendChild(nameDiv);
            professionalDiv.appendChild(iconDiv);
            
            mainDiv.appendChild(professionalDiv);
            row.appendChild(mainDiv);

            professionalDiv.addEventListener("click", ev => {
                api.post('/profile/userid', {id : dados.idUser})
                        .then(async res =>{
                            if(res.status === 200){
                                let selected = dados;
                                alert(dados.idUser);
                                console.log(selected);
                            }
                        })
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