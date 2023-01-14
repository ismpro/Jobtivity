"use strict";

// Create dataController function to create professional card element
let dataController = tableMaker("list-row", (element) => {

    // Create main container div
    let mainDiv = document.createElement("div");
    mainDiv.className = "col-12 col-md-6 col-lg-4";

    // Create professional container div
    let professionalDiv = document.createElement("div");
    professionalDiv.className = "clean-product-item";

    // Create image container div
    let imgDiv = document.createElement("div");
    imgDiv.id = "profileImage";
    imgDiv.classList.add("rounded-circle", "mb-3", "mt-4");
    imgDiv.style.margin = "auto";
    imgDiv.style.textAlign = "center";
    imgDiv.style.width = "100px";
    imgDiv.style.height = "100px";
    imgDiv.style.fontSize = "45px";
    imgDiv.style.lineHeight = "100px";
    imgDiv.textContent = element.name.toLocaleUpperCase().charAt(0);

    // Create name container div
    let nameDiv = document.createElement("div");
    nameDiv.className = "product-name";

    let locationDiv = document.createElement("div");
    locationDiv.className = "product-name";

    // Create name element
    let name = document.createElement("h5");
    name.className = "text-center";
    name.textContent = element.name;

    // Create location element
    let location = document.createElement("label");
    location.textContent = element.local;

    // Create icon container div
    let iconDiv = document.createElement("div");
    iconDiv.className = "text-center";

    // Append name element to name container div
    nameDiv.appendChild(name);
    locationDiv.appendChild(location);

    // Append image and name container divs to professional container div
    professionalDiv.appendChild(imgDiv);
    professionalDiv.appendChild(nameDiv);
    professionalDiv.appendChild(locationDiv);

    // Append professional container div to main container div
    mainDiv.appendChild(professionalDiv);

    // Add click event to professional container div to redirect to profile page
    professionalDiv.addEventListener("click", ev => {
        window.location.href = `/profile?id=${element.idUser}`;
    })

    // Return main container div
    return mainDiv;
}, "No public profiles", 6);

// Listen for DOMContentLoaded event
window.addEventListener("DOMContentLoaded", function () {
    // Make API call to get people data
    api.get('/people/all').then(res => {
        // Check if response status is 200 and data is of object type
        if (res.status === 200 && typeof res.data === 'object') {
            console.log(res.data);
            // Add data to dataController function
            dataController.addData(res.data);
        }
    });
});
