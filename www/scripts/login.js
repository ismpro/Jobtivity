"use strict";

/**
 * 
 * @param {SubmitEvent} ev 
 */
function submitLogin(ev) {
    ev.preventDefault();
    const data = new FormData(ev.target);
    console.log([...data.entries()]);

    let sendObj = {
        email: data.get("email"),
        password: data.get("password")
    }
    //createSpinner("loginButton");

    api.post('/auth/login', sendObj)
        .then(function (res) {
            let code = res.status
            if (code === 200) {
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else if (code === 211) {
                //removeSpinner("loginButton");
            }
        })
        .catch(function (err) {
            console.log(err);
        });
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
}

function removeSpinner(id) {
    let div = document.querySelector(".lds-ellipsis");
    let parent = div.parentElement;

    //<input id="loginButton" class="btn btn-primary" type="submit" value="Log In">

    let input = document.createElement('input');
    input.className = "btn btn-primary";
    input.type = "submit";
    input.id = id;
    input.value = "Log In";

    parent.appendChild(input);
    div.remove();
}