"use strict";

window.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector('ul.navbar-nav');

    api.post('/auth/validate').then((res) => {
        if (res.status === 200) {
            if (res.data.isAuth) {

                let logout = document.createElement("a");
                logout.className = "btn";
                logout.href = "javascript:void(0)";
                logout.textContent = "Logout";
                logout.id = "logoutid";
                logout.onclick = onLogout(api);

                let people = document.createElement("a");
                people.classList.add("nav-link");
                if (window.location.href.includes('/people')) people.classList.add("active");
                people.href = "/people";

                let img = document.createElement("img");
                img.src = "images/Icons/job-icon.png";
                img.style.width = '50px';

                people.appendChild(img);
                people.appendChild(document.createTextNode("People"));

                navbar.appendChild(createLI(people, "nav-item"));

                //Criar botão perfil caso seja profissional
                if (res.data.isProfessional) {
                    let profile = document.createElement("a");
                    profile.classList.add("nav-link");
                    if (window.location.href.includes('/profile')) profile.classList.add("active");
                    profile.href = "/profile";

                    let img = document.createElement("img");
                    img.src = "images/Icons/job-icon.png";
                    img.style.width = '50px';

                    profile.appendChild(img);
                    profile.appendChild(document.createTextNode("Profile"));

                    navbar.appendChild(createLI(profile, "nav-item"));

                    if (typeof onReadyToMakeFriends === 'function') onReadyToMakeFriends();
                }


                if (res.data.isAdmin) {
                    let adminA = document.createElement("a");
                    adminA.classList.add("nav-link");
                    if (window.location.href.includes('/admin')) adminA.classList.add("active");
                    adminA.href = "/admin";

                    let img = document.createElement("img");
                    img.src = "images/Icons/job-icon.png";
                    img.style.width = '50px';

                    adminA.appendChild(img);
                    adminA.appendChild(document.createTextNode("Admin Page"));

                    navbar.appendChild(createLI(adminA, "nav-item"));
                }

                navbar.appendChild(createLI(logout));

                return;
            }
        }
        makeLogin(navbar);

    }).catch(err => console.log(err))
});

function makeLogin(navbar) {
    let loginA = document.createElement("a");
    let registerA = document.createElement("a");

    loginA.className = "btn";
    registerA.className = "btn btn-primary";

    loginA.href = "/login";
    registerA.href = "/registration";

    loginA.textContent = "Login";
    registerA.textContent = "Register";

    navbar.appendChild(createLI(loginA));
    navbar.appendChild(createLI(registerA));
}

function createLI(child, cla) {
    let li = document.createElement("li");
    li.className = cla || "nav-item d-xl-flex align-items-xl-center";
    li.appendChild(child);
    return li;
}

function onLogout(api) {
    return function () {
        api.post('/auth/logout').then(res => {
            if (res.status === 200) {
                if (['/admin', '/profile', '/people'].includes(window.location.pathname)) {
                    window.location.href = '/';
                } else {
                    let li = document.getElementById("logoutid");
                    li.parentElement.remove();
                    makeLogin(document.querySelector('ul.navbar-nav'));
                    if (typeof deleteChat === 'function') deleteChat();
                }
            }
        });
    }
}