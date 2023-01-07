window.addEventListener("DOMContentLoaded", function () {
    const api = axios.create({
        baseURL: window.location.origin,
        withCredentials: true,
    });

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

                if (res.data.isAdmin) {
                    let adminA = document.createElement("a");
                    adminA.className = "nav-link";
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
    registerA.href = "/reregistrationg";

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
                if (['/admin', '/admin.html'].includes(window.location.pathname)) {
                    window.location.href = '/';
                } else {
                    let li = document.getElementById("logoutid");
                    li.parentElement.remove();
                    makeLogin(document.querySelector('ul.navbar-nav'));
                }
            }
        });
    }
}