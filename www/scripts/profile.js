"use strict";
if(!api){
    var api = axios.create({
        baseURL: window.location.origin,
        withCredentials: true,
    });
}


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
    /*
    edit-profile
    add-experience
    edit-experience
    delete-experience
    add-academic
    edit-academic
    delete-academic
    */
    let buildDom = function(){
        let lblName = document.getElementById("user-name");
        let lblLocation = document.getElementById("user-location");
        let lblDescription = document.getElementById("user-description");
        let icoEditProfile = document.getElementById("edit-profile");
        
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

    let hideEditFields = function(){
        [].forEach.call(document.querySelectorAll('.material-icons'), function (el) {
            
            el.style.display = 'none';
          });
        buildDom();
    }

    return {
        addData: add,
        hide: hideFields,
        hideEdit: hideEditFields
    }

}());

window.addEventListener("DOMContentLoaded", function () {
    const query = new URLSearchParams(window.location.href);
            if(query.has(window.location.origin + window.location.pathname + "?id")) {
                let id = query.get(window.location.origin + window.location.pathname + "?id")
                api.get(`/profile/user?id=${id}`).then(res => {
                    if (res.status === 200 && typeof res.data === 'object') {
                        console.log(res.data);
                        dataController.addData(res.data);        
                        dataController.hide();
                        dataController.hideEdit();
                        dataController.onEdit();
                    }
                });
            }else{
                api.get('/profile/user').then(res => {
                    if (res.status === 200 && typeof res.data === 'object') {
                        console.log(res.data);
                        dataController.addData(res.data);        
                        dataController.hide();  
                    }
                });
            }

    
});