"use strict";

//TODO: Browser está a dar submit no form quando eu tenho um preventDefault ??????????????
let canSend = false;

/**
 * 
 * @param {Event} ev 
 */
function firstSignUp(ev) {
    ev.preventDefault();
    createSpinner("firstButton");

    const data = new FormData(document.querySelector("form"));

    let textEle = document.getElementById("errorTextFirst");
    textEle.textContent = "";
    textEle.style.color = "red";

    api.post('/auth/checkemail', { email: data.get("email"), password: data.get("pass1"), confirmPassword: data.get("pass2") })
        .then(function (res) {
            let code = res.status
            if (code === 200) {
                document.getElementById('firstform').style.display = "none";
                if (document.getElementById('checkIsComp').checked) {
                    document.getElementById('compForm').style.display = "block";
                } else {
                    document.getElementById('profForm').style.display = "block";
                }
                canSend = true;
            } else if (code === 210) {
                textEle.appendChild(document.createTextNode(res.data));
            } else if (code === 215) {
                let errors = res.data.errors;

                if (errors.length > 0) {
                    textEle.appendChild(document.createTextNode(errors[0].msg));
                } else {
                    textEle.appendChild(document.createTextNode("ERROR"));
                }
            }
            removeSpinnerFirst();
        })
        .catch(function (err) {
            console.error(err);
            textEle.appendChild(document.createTextNode("ERROR"));
            removeSpinnerFirst();
        });
}

function backSignUp(ev) {
    ev.preventDefault();
    document.getElementById('firstform').style.display = "block";
    document.getElementById('compForm').style.display = "none";
    document.getElementById('profForm').style.display = "none";
    canSend = false;
}

/**
 * 
 * @param {SubmitEvent} ev 
 */
function submitRegister(ev) {
    ev.preventDefault();
    if (canSend) {
        const data = new FormData(ev.target);
        console.log([...data.entries()]);

        let sendObj = {};
        let id = "";

        let errorText;

        if (data.get("checkIsComp") === null) {
            sendObj = {
                email: data.get("email"),
                password: data.get("pass1"),
                confirmPassword: data.get("pass2"),
                name: data.get("nameProf"),
                description: data.get("descriptionProf"),
                birthDate: data.get("birth"),
                gender: data.get("gender"),
                local: data.get("location"),
                private: data.get("visableTo") !== null,
            }
            id = 'profInput';
            errorText = document.getElementById("errorTextProf");
        } else {
            sendObj = {
                email: data.get("email"),
                password: data.get("pass1"),
                confirmPassword: data.get("pass2"),
                name: data.get("nameComp"),
                urlWeb: data.get("urlWeb"),
                urlLogo: data.get("urlLogo"),
                description: data.get("descriptionComp")
            }
            id = 'compInput';
            errorText = document.getElementById("errorTextComp");
        }

        createSpinner(id);

        sendObj.isCompany = data.get("checkIsComp") !== null;

        let alert = document.getElementById("alertText");
        var bsAlert = new bootstrap.Alert(alert.parentElement);

        alert.innerHTML = "";
        errorText.textContent = "";

        api.post('/auth/register', sendObj)
            .then(function (res) {
                let code = res.status
                if (code === 200) {
                    alert.appendChild(document.createTextNode("Registed Successful"));
                    alert.parentElement.classList.add("alert-success");
                    alert.parentElement.classList.remove("visually-hidden");
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1000);
                } else if (code === 210) {
                    alert.appendChild(document.createTextNode(res.data));
                    alert.parentElement.classList.add("alert-danger");
                    alert.parentElement.classList.remove("visually-hidden");
                } else if (code === 215) {
                    let errors = res.data.errors;

                    if (errors.length > 0) {
                        errorText.appendChild(document.createTextNode(errors[0].msg));
                    } else {
                        errorText.appendChild(document.createTextNode("ERROR"));
                    }
                }

                removeSpinner(id);
            })
            .catch(function (err) {
                console.log(err);
                errorText.appendChild(document.createTextNode("ERROR"));
                removeSpinner(id);
            });
    }
}

function createSpinner(id) {
    let input = document.getElementById(id);

    let parent = input.parentElement;

    //<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>

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

    let inputBack = document.getElementById(id + "Back");
    if (inputBack) inputBack.remove();
}

function removeSpinner(id) {
    let div = document.querySelector(".lds-ellipsis");
    let parent = div.parentElement;

    //<input id="compInput" class="btn btn-primary" type="submit" style="margin-top: 10px;" value="Sign Up">
    //<button id="profInputBack" class="btn btn-primary" onclick="javascript:backSignUp(event)" style="margin-top: 10px;">Back</button>

    let input = document.createElement('input');
    input.className = "btn btn-primary";
    input.type = "submit";
    input.style = "margin-top: 10px;";
    input.value = "Sign Up";
    input.id = id;

    parent.appendChild(input);

    let button = document.createElement("button");
    button.id = id + "Back";
    button.className = "btn btn-primary";
    button.onclick = (event) => backSignUp(event);
    button.style = "margin-top: 10px;";
    button.appendChild(document.createTextNode("Back"));

    parent.appendChild(button);


    div.remove();
}

function removeSpinnerFirst() {
    let div = document.querySelector(".lds-ellipsis");
    let parent = div.parentElement;

    //<button id="firstButton" class="btn btn-primary" onclick="javascript: firstSignUp(event)" style="margin-top: 10px;">Next</button>

    let input = document.createElement('button');
    input.className = "btn btn-primary";
    input.style = "margin-top: 10px;";
    input.onclick = (event => firstSignUp(event))
    input.id = "firstButton";
    input.appendChild(document.createTextNode("Next"))

    parent.appendChild(input);
    div.remove();
}

