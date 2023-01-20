"use strict";
/**
 * Function to build the DOM elements with the given data
 * @function buildDom
 * @param {Object} data - The data to be used to build the DOM elements
 */
let buildDom = function (data) {
  // Variables for DOM elements
  let lblName = document.getElementById("user-name");
  let lblLocation = document.getElementById("user-location");
  let lblDescription = document.getElementById("user-description");
  let inputName = document.getElementById("name");
  let inputDescription = document.getElementById("description");
  let inputLocal = document.getElementById("local");
  let inputCheckbox = document.getElementById("privateCheckbox");
  let modal = document.querySelector(".modal-body.row");
  let divImage = document.createElement("div");
  let addExperience = document.getElementById("add-experience");
  let addAcademic = document.getElementById("add-academic");
  
  // Set the text content and styles of the labels.
  lblName.textContent = data.name;
  lblName.style.fontWeight = "bold";
  lblLocation.textContent = data.local;
  lblDescription.textContent = data.description;
  lblDescription.style.textAlign = "justify";
  
  // Check the private checkbox if data.private is true
  if(data.private){
    inputCheckbox.checked = true;
  }
  
  // Hide input elements from profile
  inputName.style.display = "none";
  inputDescription.style.display = "none";
  inputLocal.style.display = "none";

  // Set styles and class for the image div
  divImage.classList.add("rounded-circle", "mb-3", "mt-4", "profileImage");
  divImage.style.margin = "auto";
  divImage.style.textAlign = "center";
  divImage.style.width = "100px";
  divImage.style.height = "100px";
  divImage.style.fontSize = "45px";
  divImage.style.lineHeight = "100px";

  // Set as content of div image the first letter of user name.
  divImage.textContent = data.name.toLocaleUpperCase().charAt(0);

  // Add the div element before the parent of the label name element
  lblName.parentElement.before(divImage);

  // Build DOM for Academic & Experience
  let ulAcademic = document.getElementById("academic");
  let ulExperience = document.getElementById("experience");
  ulAcademic.style.listStyleType = "none";
  ulExperience.style.listStyleType = "none";
  
  // Loop through the experience array of the data object
  for (let element of data.experience) {
    // Building DOM for Experience
    let li = document.createElement("li");
    let div = document.createElement("div");
    let divIco = document.createElement("div");
    
    let hr = document.createElement("hr");
    let lblCompany = document.createElement("h5");
    let lblUrl = document.createElement("a");
    let lblBeginDate = document.createElement("h5");
    let lblEndDate = document.createElement("h5");
    let lblDesc = document.createElement("h5");
    let aEdit = document.createElement("a");
    let iEdit = document.createElement("i");
    let aDelete = document.createElement("a");
    let iDelete = document.createElement("i");

    div.className = "mb-3";
    li.className = "mb-3";
    aEdit.href = "javascript:void(0)"
    aDelete.href = "javascript:void(0)"
    iEdit.setAttribute("data-bs-toggle", "modal");
    iEdit.setAttribute("data-bs-target", "#modal1");
    iEdit.id = "edit-experience";
    iEdit.className = "material-icons";
    iEdit.style.textAlign = "right";
    iEdit.textContent = "edit";
    iDelete.id = "delete-experience";
    iDelete.className = "material-icons";
    iDelete.style.textAlign = "right";
    iDelete.textContent = "clear";
    li.style.display = "inline-block";
    li.style.maxWidth = "75%";
    li.style.overflow = "hidden";
    divIco.style.display = "inline-block";
    divIco.style.float = "right";


    aEdit.appendChild(iEdit);
    aDelete.appendChild(iDelete);

    hr.style.borderTop = "2px solid black";
    lblCompany.style.fontSize = "20px";
    lblCompany.style.fontWeight = "bold";
    lblUrl.style.fontSize = "15px";
    lblBeginDate.style.fontSize = "15px";
    lblEndDate.style.fontSize = "15px";
    lblDesc.style.fontSize = "15px";

    lblCompany.textContent = element.name;

    if(element.url.includes("http://")){
      lblUrl.textContent = element.url.substring(7);
    }else{
      lblUrl.textContent = element.url.substring(8);
    }
    
    lblUrl.href = element.url;
    
    lblUrl.target = "_blank";
    lblBeginDate.textContent = "Start Date: " + new Date(element.beginDate).toLocaleDateString();
    lblEndDate.textContent = "End Date: " + new Date(element.endDate).toLocaleDateString();
    lblDesc.textContent = element.description;

    li.appendChild(lblCompany);
    li.appendChild(lblUrl);
    li.appendChild(lblBeginDate);
    li.appendChild(lblEndDate);
    li.appendChild(lblDesc);
    divIco.appendChild(aEdit);
    divIco.appendChild(aDelete);
    
    div.appendChild(li);
    div.appendChild(divIco);

    aEdit.addEventListener("click", (evt) => {
      makeModal(modal, element, "experience", "edit");
    });

    aDelete.addEventListener("click", evt => {
      if(confirm("Do you really want to delete this experience?")){
        api.delete("/profile/experience", {data: {id: element.id}}).then((res) => {
          if(res.status == 200){
            console.log(res.data);
          }else{
            console.log("Error");
          }
        });
      }
    });

    if (data.experience.length > 1) {
      div.appendChild(hr);
    }

    ulExperience.appendChild(div);
  }
  // Loop through the qualification array of the data object
  for (let element of data.qualification) {
    //Building DOM for Qualification
    let li = document.createElement("li");
    let div = document.createElement("div");
    let divIco = document.createElement("div");
    
    let hr = document.createElement("hr");
    let lblSchool = document.createElement("h5");
    let lblCourse = document.createElement("h5");
    let lblGrade = document.createElement("h5");
    let aEdit = document.createElement("a");
    let iEdit = document.createElement("i");
    let aDelete = document.createElement("a");
    let iDelete = document.createElement("i");

    lblSchool.style.fontWeight = "bold";
    div.className = "info";
    li.className = "info";
    aEdit.href = "javascript:void(0)"
    aDelete.href = "javascript:void(0)"
    iEdit.setAttribute("data-bs-toggle", "modal");
    iEdit.setAttribute("data-bs-target", "#modal1");
    iEdit.id = "edit-experience";
    iEdit.className = "material-icons";
    iEdit.style.textAlign = "right";
    iEdit.textContent = "edit";
    iDelete.id = "delete-experience";
    iDelete.className = "material-icons";
    iDelete.style.textAlign = "right";
    iDelete.textContent = "clear";
    li.style.display = "inline-block";
    li.style.maxWidth = "75%";
    li.style.overflow = "hidden";
    divIco.style.display = "inline-block";
    divIco.style.float = "right";

    aEdit.appendChild(iEdit);
    aDelete.appendChild(iDelete);


    hr.style.borderTop = "2px solid black";
    lblSchool.style.fontSize = "20px";
    lblCourse.style.fontSize = "15px";
    lblGrade.style.fontSize = "15px";

    lblSchool.textContent = element.local;
    lblCourse.textContent = element.type + " in " +  element.name;
    lblGrade.textContent = "Final grade: " + element.grade + " in 20";

    li.appendChild(lblSchool);
    li.appendChild(lblCourse);
    li.appendChild(lblGrade);
    divIco.appendChild(aEdit);
    divIco.appendChild(aDelete);

    div.appendChild(li);
    div.appendChild(divIco);
    if (data.qualification.length > 1) {
      div.appendChild(hr);
    }

    ulAcademic.appendChild(div);

    aDelete.addEventListener("click", evt => {
      if(confirm("Do you really want to delete this qualification?")){
        api.delete("/profile/qualification", {data: {id: element.id}}).then((res) => {
          if(res.status == 200){
            console.log(res.data);
          }else{
            console.log("Error");
          }
        });
      }
    })

    aEdit.addEventListener("click", evt => {
      console.log(element);
      makeModal(modal, element, "academic", "edit");
      
    })
  }

  addExperience.addEventListener("click", (evt) => {
    makeModal(modal, data, "experience");
  });

  addAcademic.addEventListener("click", (evt) => {
    makeModal(modal, data, "academic");
  });
  
  [].forEach.call(
    document.querySelectorAll(".material-icons"),
    function (el){
      el.style.color = "#3e588f";
    }
  )
};


/**
 * @function makeModal
 * @param {HTMLElement} modal - modal element 
 * @param {Object} data - data object 
 * @param {String} type - type of the data, 'experience' or 'academic'
 * @param {String} action - the action to be performed on the modal, used on "edit"
 * This function creates a modal to create or edit the experience or academic with the provided data 
 */
let makeModal = function (modal, data, type, action) {
    // Check if the modal already has a form element and remove it
    let existForm = document.getElementById("modal1").querySelector("form");
    if (existForm) {
      existForm.remove();
    }

    // Create form elements based on type
    if (type == "experience") {
      let form = document.createElement("form");
      let lblName = document.createElement("label");
      let lblUrl = document.createElement("label");
      let lblBeginDate = document.createElement("label");
      let lblEndDate = document.createElement("label");
      let lblDescription = document.createElement("label");
      let modalDialog = document.getElementById("modal-dialog");
      let modalTitle = document.getElementById("modal-title");
      let textEle = document.createElement("p");
      textEle.textContent = "";
      textEle.style.color = "red";
      
      // Properties of modal elements
      modalDialog.style.maxWidth = "35%";
      modalDialog.style.padding = "20px";
      lblName.textContent = "Company: ";
      lblUrl.textContent = "URL: ";
      lblBeginDate.textContent = "Start Date: ";
      lblEndDate.textContent = "End Date: ";
      lblDescription.textContent = "Description: ";

      // Inputs of modal elements
      let inputName = document.createElement("input");
      let inputUrl = document.createElement("input");
      let inputBeginDate = document.createElement("input");
      let inputEndDate = document.createElement("input");
      let inputDescription = document.createElement("TEXTAREA");
      let btnSubmit = document.createElement("button");
      btnSubmit.type = "button";
      btnSubmit.textContent = "Submit";
      btnSubmit.className = "btn btn-primary";

      // Properties of input elements
      inputName.type = "text";
      inputUrl.type = "url";
      inputBeginDate.type = "date";
      inputEndDate.type = "date";
      inputDescription.style.resize = "none";

      modalTitle.textContent = "Add Experience";

      inputName.style.marginBottom = "2rem";
      inputUrl.style.marginBottom = "2rem";
      inputBeginDate.style.marginBottom = "2rem";
      inputEndDate.style.marginBottom = "2rem";
      
      form.style.display = "flex";
      form.style.flexDirection = "column";
      form.style.alignItems = "center";
      form.style.justifyContent = "space-between";

      form.appendChild(lblName);
      form.appendChild(inputName);

      form.appendChild(lblUrl);
      form.appendChild(inputUrl);

      form.appendChild(lblBeginDate);
      form.appendChild(inputBeginDate);

      form.appendChild(lblEndDate);
      form.appendChild(inputEndDate);

      form.appendChild(lblDescription);
      form.appendChild(inputDescription);
      form.appendChild(textEle);

      form.appendChild(btnSubmit);

      modal.appendChild(form);

      // If action is edit, populate form with the data
      if(action == "edit"){
        inputName.value = data.name;
        inputUrl.value = data.url;
        inputBeginDate.value = data.beginDate.substring(0,10);
        inputEndDate.value = data.endDate.substring(0,10);
        inputDescription.value = data.description;

        btnSubmit.addEventListener("click", evt => {
          evt.preventDefault();
          const name = inputName.value;
          const url = inputUrl.value;
          const beginDate = inputBeginDate.value;
          const endDate = inputEndDate.value;
          const description = inputDescription.value;
          const id = data.id;
          // Create the object that will be sent in the request
            let sendObj = {
              id: id,
              name: name,
              url: url,
              beginDate: beginDate,
              endDate: endDate,
              description: description
            };
            // API call to update the experience
            api.put("/profile/experience", sendObj).then(function (res) {
              if (res.status == 200) {
                window.location.reload();
              } else if (res.status === 215) {
                let errors = res.data.errors;
                console.log(errors);
                if (errors.length > 0) {
                  textEle.appendChild(document.createTextNode(errors[0].msg));
                } else {
                  textEle.appendChild(document.createTextNode("ERROR"));
                }
              }else {
                res.status(500).send("erro");
              }
            });
          })
      }
      if(action !== "edit"){
        let sendObj = [];
        let alert = document.getElementById("alertText");
        // Event listener to Submit button
        btnSubmit.addEventListener("click", (evt) => {
          // Object that will be sent in the request
          sendObj = {
            name: inputName.value,
            url: inputUrl.value,
            beginDate: inputBeginDate.value,
            endDate: inputEndDate.value,
            description: inputDescription.value,
            id: data.idProfessional,
          };
          // API call to create a new experience
          api.post("/profile/experience", sendObj).then(function (res) {
            alert.appendChild(document.createTextNode("Successfull!"));
            alert.parentElement.classList.add("alert-success");
            alert.parentElement.classList.remove("visually-hidden");
            if (res.status == 200) {
              window.location.reload();
            }else if (res.status === 215) {
              let errors = res.data.errors;
              console.log(errors);
              if (errors.length > 0) {
                textEle.appendChild(document.createTextNode(errors[0].msg));
              } else {
                textEle.appendChild(document.createTextNode("ERROR"));
              }
            }else {
              res.send("erro");
            }
          });
        });
      } 
    } else if (type == "academic") {
      let form = document.createElement("form");
      let lblLocal = document.createElement("label");
      let lblName = document.createElement("label");
      let lblType = document.createElement("label");
      let lblGrade = document.createElement("label");
      let modalDialog = document.getElementById("modal-dialog");
      let modalTitle = document.getElementById("modal-title");
      let textEle = document.createElement("p");
      textEle.textContent = "";
      textEle.style.color = "red";

      // Properties of modal elements
      modalDialog.style.maxWidth = "35%";
      modalDialog.style.padding = "20px";
      lblLocal.textContent = "Institution: ";
      lblName.textContent = "Course: ";
      lblType.textContent = "Type: ";
      lblGrade.textContent = "Grade: ";

      modalTitle.textContent = "Add Qualification";

      // Inputs of modal elements
      let inputLocal = document.createElement("input");
      let inputName = document.createElement("input");
      let inputType = document.createElement("input");
      let inputGrade = document.createElement("input");
      let btnSubmit = document.createElement("button");

      // If action is edit, populate form with the data
      if(action == "edit"){
        inputLocal.value = data.local;
        inputName.value = data.name;
        inputType.value = data.type;
        inputGrade.value = data.grade;

        // Event listener to submit button
        btnSubmit.addEventListener("click", evt => {
        evt.preventDefault();
        const local = inputLocal.value;
        const name = inputName.value;
        const type = inputType.value;
        const grade = inputGrade.value;
        const id = data.id;
        // Create the object that will be sent in the request
          let sendObj = {
            id: id,
            local: local,
            name: name,
            type: type,
            grade: grade
          };
          // API call to update the qualification
          api.put("/profile/qualification", sendObj).then(function (res) {
            if (res.status == 200) {
              window.location.reload();
            } else if (res.status === 215) {
              let errors = res.data.errors;
              console.log(errors);
              if (errors.length > 0) {
                textEle.appendChild(document.createTextNode(errors[0].msg));
              } else {
                textEle.appendChild(document.createTextNode("ERROR"));
              }
            }else {
              res.status(500).send("erro");
            }
          });
        })
      }

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

      form.appendChild(textEle);
      form.appendChild(btnSubmit);

      modal.appendChild(form);

      let sendObj = [];

      let alert = document.getElementById("alertText");

      if(action !== "edit"){
        btnSubmit.addEventListener("click", (evt) => {
          // Object that will be sent in the request
          sendObj = {
            local: inputLocal.value,
            name: inputName.value,
            type: inputType.value,
            grade: inputGrade.value,
            id: data.idProfessional,
          };
          // API call to create a new qualification
          api.post("/profile/qualification", sendObj).then(function (res) {
            alert.appendChild(document.createTextNode("Successfull!"));
            alert.parentElement.classList.add("alert-success");
            alert.parentElement.classList.remove("visually-hidden");
            if (res.status == 200) {
              window.location.reload();
            } else if (res.status === 215) {
              let errors = res.data.errors;
              console.log(errors);
              if (errors.length > 0) {
                textEle.appendChild(document.createTextNode(errors[0].msg));
              } else {
                textEle.appendChild(document.createTextNode("ERROR"));
              }
            } else {
              res.status(500).send("erro");
            }
          });
        });
      }
    }
};

/**
 * @function hide
 * @param {String} className - class name of the elements to be hidden
 * @desc This function is used to hide elements with a given class name
 */
let hide = function (className) {
  // Iterate over all elements with specific class name
  [].forEach.call(
    document.querySelectorAll("." + className),
    function (el){
      // Set display property to none
      el.style.display = "none";
    }
  )
}

/**
 * @function show
 * @param {String} className - class name of the elements to be shown
 * @desc This function is used to show elements with a given class name
 */
let show = function (className){
  // Iterate over all elements with specific class name
  [].forEach.call(
    document.querySelectorAll("." + className),
    function (el){
      // Set display property to inline-block
      el.style.display = "inline-block";
    }
  )
}

/**
 * @function onEdit
 * @param {Object} data - Data of the user
 * @desc This function is used to enable editing for the user's profile
 */
let onEdit = function (data) {
    let icoEditProfile = document.getElementById("edit-profile");
    let icoSave = document.getElementById("save-profile");
    let lblName = document.getElementById("user-name");
    let lblCheckbox = document.getElementById("label-checkbox");
    let lblLocation = document.getElementById("user-location");
    let lblDescription = document.getElementById("user-description");
    let inputName = document.getElementById("name");
    let inputLocation = document.getElementById("local");
    let inputDescription = document.getElementById("description");

    // Set the value of input fields with label values
    inputName.value = lblName.textContent;
    inputLocation.value = lblLocation.textContent;
    inputDescription.value = lblDescription.textContent;
    lblCheckbox.textContent = "Private";

    // Show the input fields and hide the labels to enable editing
    show(inputName.className);
    hide(lblName.className);

    inputDescription.style.width = "550px";
    icoEditProfile.style.display = "none";
    icoSave.style.display = "inline-block";
    
    // Event listener to save button
    icoSave.addEventListener("click", (evt) => {
      icoEditProfile.style.display = "inline-block";
      icoSave.style.display = "none";
      evt.preventDefault();
      const name = document.getElementById("name").value;
      const description = document.getElementById("description").value;
      const local = document.getElementById("local").value;
      const privateCheck = document.getElementById("privateCheckbox").checked;
      const id = data.idProfessional;
      // Show labels and hide the input fields
      show(lblName.className);
      hide(inputName.className);

      // Object that will be sent in the request
      let sendObj = {
        id: id,
        name: name,
        description: description,
        local: local,
        private: privateCheck
      };

      // API call to update the user info
      api.put("/profile/user", sendObj).then(function (res) {
        if (res.status == 200) {
          lblName.textContent = name;
          lblLocation.textContent = local;
          lblDescription.textContent = description;
        } else {
          res.status(500).send("erro");
        }
      });
    });
};

/**
 * DOMContentLoaded event listener function that retrieves user data from the API and builds the DOM
 * based on the URL query parameters.
 */
window.addEventListener("DOMContentLoaded", function () {
  // Create a new URLSearchParams object to parse the current URL
  const query = new URLSearchParams(window.location.href);
  // Get edit-profile DOM element
  let icoEditProfile = document.getElementById("edit-profile");
  // Check if the URL has an id query parameter
  if (query.has(window.location.origin + window.location.pathname + "?id")) {
    // Get the value of the id query parameter
    let id = query.get(
      window.location.origin + window.location.pathname + "?id"
    );
    // API GET request to retrieve user data based on the id
    api.get(`/profile/user?id=${id}`).then((res) => {
      if (res.status === 200 && typeof res.data === "object") {
        // Build the DOM using the user data
        buildDom(res.data);
        hide(icoEditProfile.className);
      }
    });
  } else {
    // Make a GET request to the API to retrieve the current user data
    api.get("/profile/user").then((res) => {
      if (res.status === 200 && typeof res.data === "object") {
        // Build the DOM using the user data
        buildDom(res.data);
        // Event listener to call onEdit function
        icoEditProfile.addEventListener("click", (evt) => {
          onEdit(res.data);
        });
      }
    });
  }
});
