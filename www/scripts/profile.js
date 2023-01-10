"use strict";

const dataController = (function () {
  let data = [];

  let add = function (obj) {
    console.log(data);
    data = obj;
    console.log("teste");
    console.log(data);
    //dataOriginal = JSON.parse(JSON.stringify(obj));
    /* data = data.map((professional, index) => ({ ...professional, id: index }));
        dataOriginal = dataOriginal.map((professional, index) => ({ ...professional, id: index }));
        console.log(data); */
    buildDom();
  };
  /*
    edit-profile
    add-experience
    edit-experience
    delete-experience
    add-academic
    edit-academic
    delete-academic
    */
  let buildDom = function () {
    let lblName = document.getElementById("user-name");
    let lblLocation = document.getElementById("user-location");
    let lblDescription = document.getElementById("user-description");
    let inputName = document.getElementById("name");
    let inputDescription = document.getElementById("description");
    let inputLocal = document.getElementById("local");
    lblName.textContent = data.name;
    lblLocation.textContent = data.local;
    lblDescription.textContent = data.description;
    inputName.style.display = 'none';
    inputDescription.style.display = 'none';
    inputLocal.style.display = 'none';
  };

  let hideFields = function () {
    let btnMessage = document.getElementById("direct-message");
    let btnRemove = document.getElementById("remove-friend");
    btnMessage.style.visibility = "hidden";
    btnRemove.style.visibility = "hidden";
    buildDom();
  };

  let hideEditFields = function () {
    [].forEach.call(
      document.querySelectorAll(".material-icons"),
      function (el) {
        el.style.display = "none";
      }
    );
    buildDom();
  };

  let onEdit = function (){
    let icoEditProfile = document.getElementById("edit-profile");
    let icoSave = document.getElementById("save-profile");
    let lblName = document.getElementById("user-name");
    let lblLocation = document.getElementById("user-location");
    let lblDescription = document.getElementById("user-description");
    let inputName = document.getElementById("name");
    let inputLocation = document.getElementById("local");
    let inputDescription = document.getElementById("description");
    inputName.value = lblName.textContent;
    inputLocation.value = lblLocation.textContent;
    inputDescription.value = lblDescription.textContent;

    inputName.style.display = 'inline-block';
    inputLocation.style.display = 'inline-block';
    inputDescription.style.display = 'inline-block';

    lblName.style.display = 'none';
    lblLocation.style.display = 'none';
    lblDescription.style.display = 'none';
    
    inputDescription.style.width = '550px';

    icoEditProfile.style.display = 'none';
    icoSave.style.display = 'inline-block';

    icoSave.addEventListener("click", evt => { 
        icoEditProfile.style.display = 'inline-block';
        icoSave.style.display = 'none';
        evt.preventDefault();
        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const local = document.getElementById("local").value;
        const id = data.idProfessional;

        lblName.style.display = 'inline-block';
        lblLocation.style.display = 'inline-block';
        lblDescription.style.display = 'inline-block';
        inputName.style.display = 'none';
        inputLocation.style.display = 'none';
        inputDescription.style.display = 'none';
        let sendObj = {
            id: id,
            name: name,
            description: description,
            local: local
        }
        window.location.reload();
        console.log(data);
        api.post("/profile/user", sendObj)
            .then(function (res){
                if(res.status == 200){
                    res.send("done");
                }else{
                    res.status(500).send("erro");
                }
            })
      })
  }

  return {
    addData: add,
    hide: hideFields,
    hideEdit: hideEditFields,
    edit: onEdit
  };
})();

window.addEventListener("DOMContentLoaded", function () {
  const query = new URLSearchParams(window.location.href);
  let icoEditProfile = document.getElementById("edit-profile");
  if (query.has(window.location.origin + window.location.pathname + "?id")) {
    let id = query.get(
      window.location.origin + window.location.pathname + "?id"
    );
    api.get(`/profile/user?id=${id}`).then((res) => {
      if (res.status === 200 && typeof res.data === "object") {
        console.log(res.data);
        dataController.addData(res.data);
        dataController.hide();
        dataController.hideEdit();
      }
    });

  } else {
    api.get("/profile/user").then((res) => {
      if (res.status === 200 && typeof res.data === "object") {
        console.log(res.data);
        dataController.addData(res.data);
        dataController.hide();
        icoEditProfile.addEventListener("click", evt => {
            dataController.edit();
        })
      }
    });
  }
});
