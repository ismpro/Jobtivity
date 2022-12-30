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
    ev.preventDefault();
    document.getElementById('firstform').style.display = "none";

    if (document.getElementById('checkIsComp').checked) {
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

    sendObj.isCompany = data.get("checkIsComp") !== null;

    console.log(sendObj);

    api.post('/auth/register', sendObj)
        .then(function (res) {
            let code = res.status
            if (code === 200) {
                alert(res.data)
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}