"use strict";

const api = axios.create({
    baseURL: window.location.origin,
    withCredentials: true,
});

/**
 * 
 * @param {Event} ev 
 */
function firstSignUp(ev) {
    document.getElementById('firstform').style.display = "none";

    if (document.getElementById('checkIsComp')) {
        document.getElementById('compForm').style.display = "block";
    } else {
        document.getElementById('profForm').style.display = "block";
    }
}

/**
 * 
 * @param {SubmitEvent} ev 
 */
function submitRegister(ev) {
    ev.preventDefault();
    const data = new FormData(ev.target);
    console.log([...data.entries()]);

    let sendObj = {};

    if (data.get("checkIsComp")) {
        sendObj = {
            email: data.get("email"),
            password: data.get("pass1"),
            birthDate: data.get("birth"),
            gender: data.get("gender"),
            location: data.get("location"),
            description: data.get("descriptionProf"),
        }
    } else {
        sendObj = {
            email: data.get("email"),
            password: data.get("pass1"),
            name: data.get("nameComp"),
            urlWeb: data.get("urlWeb"),
            urlLogo: data.get("urlLogo"),
            description: data.get("descriptionComp")
        }
    }

    api.post('/auth/register', sendObj)
        .then(function (res) {
            let code = res.status
            /* if (code === 230) {
                
            } else {
                
            } */
        })
        .catch(function (err) {
            console.log(err);
        });
}