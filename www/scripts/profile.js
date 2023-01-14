"use strict";

const dataController = (function () { //ISTO NAO PRECISA DE UM DATA CONTROLLER
  let data = [];

  let add = function (obj) {
    data = obj;
    buildDom();
  };

  let buildDom = function () {
    let lblName = document.getElementById("user-name");
    let lblLocation = document.getElementById("user-location");
    let lblDescription = document.getElementById("user-description");
    let inputName = document.getElementById("name");
    let inputDescription = document.getElementById("description");
    let inputLocal = document.getElementById("local");
    let modal = document.querySelector(".modal-body.row");
    let msgDiv = document.getElementById("info-profile");
    let divImage = document.createElement("div");

    lblName.textContent = data.name;
    lblLocation.textContent = data.local;
    lblDescription.textContent = data.description;
    inputName.style.display = "none";
    inputDescription.style.display = "none";
    inputLocal.style.display = "none";
    divImage.id = "profileImage";
    divImage.classList.add('rounded-circle', 'mb-3', 'mt-4');
    

    divImage.style.margin = "auto";
    divImage.style.textAlign = "center";
    divImage.style.width = "100px";
    divImage.style.height = "100px";
    divImage.style.fontSize = "45px";
    divImage.style.lineHeight = "100px";
    
    divImage.textContent = data.name.toLocaleUpperCase().charAt(0);
    
    lblName.parentElement.before(divImage);        

    // Construir DOM para Academic
    let ulAcademic = document.getElementById("academic");
    let ulExperience = document.getElementById("experience");
    ulAcademic.style.listStyleType = "none";
    ulExperience.style.listStyleType = "none";

    for (let element of data.experience) {
      let li = document.createElement("li");
      let div = document.createElement("div");
      div.className = "info";
      let hr = document.createElement("hr");
      let lblCompany = document.createElement("h5");
      let lblUrl = document.createElement("h5");
      let lblBeginDate = document.createElement("h5");
      let lblEndDate = document.createElement("h5");
      let lblDesc = document.createElement("h5");

      hr.style.borderTop = "2px solid black";
      lblCompany.style.fontSize = "20px";
      lblUrl.style.fontSize = "15px";
      lblBeginDate.style.fontSize = "15px";
      lblEndDate.style.fontSize = "15px";
      lblDesc.style.fontSize = "15px";

      lblCompany.textContent = element.name;
      lblUrl.textContent = element.url;
      lblBeginDate.textContent = element.beginDate;
      lblEndDate.textContent = element.endDate;
      lblDesc.textContent = element.description;

      li.appendChild(lblCompany);
      li.appendChild(lblUrl);
      li.appendChild(lblBeginDate);
      li.appendChild(lblEndDate);
      li.appendChild(lblDesc);


      div.appendChild(li);

      if(data.experience.length > 1){
        div.appendChild(hr);
      }
      

      ulExperience.appendChild(div);
    }

    for (let element of data.qualification) {
      let li = document.createElement("li");
      let div = document.createElement("div");
      div.className = "info";
      let hr = document.createElement("hr");
      let lblSchool = document.createElement("h5");
      let lblCourse = document.createElement("h5");
      let lblType = document.createElement("h5");
      let lblGrade = document.createElement("h5");

      hr.style.borderTop = "2px solid black";
      lblSchool.style.fontSize = "20px";
      lblCourse.style.fontSize = "15px";
      lblType.style.fontSize = "15px";
      lblGrade.style.fontSize = "15px";

      lblSchool.textContent = element.local;
      lblCourse.textContent = element.name;
      lblType.textContent = element.type;
      lblGrade.textContent = element.grade;

      li.appendChild(lblSchool);
      li.appendChild(lblCourse);
      li.appendChild(lblType);
      li.appendChild(lblGrade);

      div.appendChild(li);

      if(data.qualification.length > 1){
        div.appendChild(hr);
      }

      ulAcademic.appendChild(div);

    }

    makeAcademicModal(modal, data);
  };

  let makeAcademicModal = function (modal, data) {
    let form = document.createElement("form");
    let lblLocal = document.createElement("label");
    let lblName = document.createElement("label");
    let lblType = document.createElement("label");
    let lblGrade = document.createElement("label");
    let modalDialog = document.getElementById("modal-dialog");

    modalDialog.style.maxWidth = "35%";
    modalDialog.style.padding = "20px";
    lblLocal.textContent = "Institution: ";
    lblName.textContent = "Course: ";
    lblType.textContent = "Type: ";
    lblGrade.textContent = "Grade: ";

    let inputLocal = document.createElement("input");
    let inputName = document.createElement("input");
    let inputType = document.createElement("input");
    let inputGrade = document.createElement("input");
    let btnSubmit = document.createElement("button");
    btnSubmit.type = "button";
    btnSubmit.textContent = "Submit";
    btnSubmit.className = "btn btn-primary";

    inputLocal.type = "text";
    inputName.type = "text";
    inputType.type = "text";
    inputGrade.type = "number";

    inputLocal.style.marginBottom = "2rem";
    inputName.style.marginBottom = "2rem";
    inputType.style.marginBottom = "2rem";
    inputGrade.style.marginBottom = "2rem";

    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.alignItems = "center";
    form.style.justifyContent = "space-between";

    form.appendChild(lblLocal);
    form.appendChild(inputLocal);

    form.appendChild(lblName);
    form.appendChild(inputName);

    form.appendChild(lblType);
    form.appendChild(inputType);

    form.appendChild(lblGrade);
    form.appendChild(inputGrade);

    form.appendChild(btnSubmit);

    modal.appendChild(form);

    let sendObj = [];

    let alert = document.getElementById("alertText");

    btnSubmit.addEventListener("click", (evt) => {
      sendObj = {
        local: inputLocal.value,
        name: inputName.value,
        type: inputType.value,
        grade: inputGrade.value,
        id: data.idProfessional,
      };

      api.post("/profile/qualification", sendObj).then(function (res) {
        alert.appendChild(document.createTextNode("Successfull!"));
        alert.parentElement.classList.add("alert-success");
        alert.parentElement.classList.remove("visually-hidden");
        if (res.status == 200) {
          window.location.reload(); //ISTO É PARA SAIR DAQUI NAO CA RELOADS DE PAGINAS
        } else {
          res.status(500).send("erro");
        }
      });
    });
  };

  let hideEditFields = function () {
    [].forEach.call(
      document.querySelectorAll(".material-icons"),
      function (el) {
        el.style.display = "none";
      }
    );
  };

  let onEdit = function () {
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

    inputName.style.display = "inline-block";
    inputLocation.style.display = "inline-block";
    inputDescription.style.display = "inline-block";

    lblName.style.display = "none";
    lblLocation.style.display = "none";
    lblDescription.style.display = "none";

    inputDescription.style.width = "550px";

    icoEditProfile.style.display = "none";
    icoSave.style.display = "inline-block";

    icoSave.addEventListener("click", (evt) => {
      icoEditProfile.style.display = "inline-block";
      icoSave.style.display = "none";
      evt.preventDefault();
      const name = document.getElementById("name").value;
      const description = document.getElementById("description").value;
      const local = document.getElementById("local").value;
      const id = data.idProfessional;

      lblName.style.display = "inline-block";
      lblLocation.style.display = "inline-block";
      lblDescription.style.display = "inline-block";
      inputName.style.display = "none";
      inputLocation.style.display = "none";
      inputDescription.style.display = "none";
      let sendObj = {
        id: id,
        name: name,
        description: description,
        local: local,
      };
      api.put("/profile/user", sendObj).then(function (res) {
        if (res.status == 200) {
          window.location.reload(); //ISTO É PARA SAIR DAQUI NAO CA RELOADS DE PAGINAS
        } else {
          res.status(500).send("erro");
        }
      });
    });
  };

  return {
    addData: add,
    hideEdit: hideEditFields,
    edit: onEdit,
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
        dataController.hideEdit();
      }
    });
  } else {
    api.get("/profile/user").then((res) => {
      if (res.status === 200 && typeof res.data === "object") {
        console.log(res.data);
        dataController.addData(res.data);
        icoEditProfile.addEventListener("click", (evt) => {
          dataController.edit();
        });
      }
    });
  }
});
