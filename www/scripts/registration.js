"use strict";

//TODO: Validacoes dos inputs

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

    if(data.get("pass1") !== '' && data.get("pass2") !== '' && data.get("pass1") !== data.get("pass2")) {
        textEle.appendChild(document.createTextNode("As palavras passe tem de ser iguais!!!"));
    }

    api.post('/auth/checkemail', { email: data.get("email"), password: data.get("pass1")})
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
            }
            removeSpinnerFirst();
        })
        .catch(function (err) {
            console.log(err);
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

        if (data.get("checkIsComp") === null) {
            sendObj = {
                email: data.get("email"),
                password: data.get("pass1"),
                name: data.get("nameProf"),
                description: data.get("descriptionProf"),
                birthDate: data.get("birth"),
                gender: data.get("gender"),
                local: data.get("location"),
                private: data.get("visableTo") !== null,
            }
            id = 'profInput'
        } else {
            sendObj = {
                email: data.get("email"),
                password: data.get("pass1"),
                name: data.get("nameComp"),
                urlWeb: data.get("urlWeb"),
                urlLogo: data.get("urlLogo"),
                description: data.get("descriptionComp")
            }
            id = 'compInput';
        }

        createSpinner(id);

        sendObj.isCompany = data.get("checkIsComp") !== null;

        let alert = document.getElementById("alertText");
        var bsAlert = new bootstrap.Alert(alert.parentElement);

        alert.innerHTML = "";

        //TODO: Remover Timeout depois de testes
        setTimeout(() => {
            api.post('/auth/register', sendObj)
                .then(function (res) {
                    let code = res.status
                    if (code === 200) {
                        alert.appendChild(document.createTextNode("Registed Successful"));
                        alert.parentElement.classList.add("alert-success");
                        alert.parentElement.classList.remove("visually-hidden");
                        setTimeout(() => {
                            //bsAlert.close();
                            window.location.href = '/login.html';
                        }, 1000);
                    } else if (code === 210) {
                        alert.appendChild(document.createTextNode(res.data));
                        alert.parentElement.classList.add("alert-danger");
                        alert.parentElement.classList.remove("visually-hidden");
                        removeSpinner(id);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        }, 2000);
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

    let inputBack = document.getElementById(id+"Back");
    if(inputBack) inputBack.remove();
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

