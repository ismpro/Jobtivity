"use strict";

const api = axios.create({
    baseURL: window.location.origin,
    withCredentials: true,
});

const dataController = (function (){

    let data = [];

    let add = function (obj){
        console.log(data);
        data = obj;
        console.log("teste");
        console.log(data);
        //dataOriginal = JSON.parse(JSON.stringify(obj));
        /* data = data.map((professional, index) => ({ ...professional, id: index }));
        dataOriginal = dataOriginal.map((professional, index) => ({ ...professional, id: index }));
        console.log(data); */
        buildDom();
    }
    
    let buildDom = function(){
        let iconProfissional = document.getElementsByClassName("material-icons");
        
        let lblName = document.getElementById("user-name");
        let lblLocation = document.getElementById("user-location");
        let lblDescription = document.getElementById("user-description");
        
        lblName.textContent = data.name;
        lblLocation.textContent = data.local;
        lblDescription.textContent = data.description;
    }

    let hideFields = function(){
        let btnMessage = document.getElementById("direct-message");
        let btnRemove = document.getElementById("remove-friend");
        btnMessage.style.visibility = 'hidden';
        btnRemove.style.visibility = 'hidden';
        buildDom();
    }

    return {
        addData: add,
        hide: hideFields 
    }

}());

window.addEventListener("DOMContentLoaded", function () {
    api.get('/profile/user').then(res => {
        if (res.status === 200 && typeof res.data === 'object') {
            console.log(res.data);
            dataController.addData(res.data);        
            dataController.hide();  
        }
    });
});