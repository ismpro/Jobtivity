"use strict";

/**
 * submitLogin - function that handles the submission of the login form
 * @param {Event} ev - the submit event
 */
function submitLogin(ev) {
    ev.preventDefault();
    const data = new FormData(ev.target);

    let sendObj = {
        email: data.get("email"),
        password: data.get("password")
    }
    createSpinner("loginButton");

    let errorText = document.getElementById("errorText");
    errorText.textContent = "";

    //Calls the login router form auth
    api.post('/auth/login', sendObj)
        .then(function (res) {
            let code = res.status
            if (code === 200) {
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else if (code === 211 || code === 225) {
                errorText.appendChild(document.createTextNode(res.data));
                removeSpinner("loginButton");
            } else if (code === 215) {
                let errors = res.data.errors;

                if (errors.length > 0) {
                    errorText.appendChild(document.createTextNode(errors[0].msg));
                } else {
                    errorText.appendChild(document.createTextNode("ERROR"));
                }
            }
        })
        .catch(function (err) {
            console.log(err);
            errorText.appendChild(document.createTextNode("ERROR"));
            removeSpinner("loginButton");
        });
}

/**
 * Creates a spinner element
 * @param {String} id - the id of the login button element removes the login button
 */
function createSpinner(id) {
    let input = document.getElementById(id);
    let parent = input.parentElement;

    let div1 = document.createElement('div');
    div1.className = "lds-ellipsis";
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    let div4 = document.createElement('div');
    let div5 = document.createElement('div');

    div1.appendChild(div2);
    div1.appendChild(div3);
    div1.appendChild(div4);
    div1.appendChild(div5);
    parent.appendChild(div1);

    input.remove();
}

/**
 * removeSpinner - removes the spinner element and re-adds the login button
 * @param {String} id - the id of the login button element
*/
function removeSpinner(id) {
    let div = document.querySelector(".lds-ellipsis");
    let parent = div.parentElement;

    let input = document.createElement('input');
    input.className = "btn btn-primary";
    input.type = "submit";
    input.id = id;
    input.value = "Log In";

    parent.appendChild(input);
    div.remove();
}