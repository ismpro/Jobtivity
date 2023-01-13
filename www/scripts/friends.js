"use strict";

function onReadyToMakeFriends() {

    let add = false;

    let main = document.querySelector("main");

    api.get('/friends').then(res => {
        if (res.status === 200) {
            const asideElement = document.createElement('aside');
            asideElement.id = 'msg-overlay';

            const msgsDiv = document.createElement('div');
            msgsDiv.classList.add('msg-overlay-list-bubble');
            msgsDiv.classList.add("msg-overlay-list-bubble-minimized"); //comentar para inciar maximizado
            asideElement.appendChild(msgsDiv);

            const headerDiv = document.createElement('div');
            headerDiv.classList.add('msg-overlay-header');

            const h3Element = document.createElement('h3');
            h3Element.textContent = 'Friends';

            const controlsDiv = document.createElement('div');
            controlsDiv.classList.add('buttons');
            asideElement.appendChild(msgsDiv);

            const buttonAddElement = document.createElement('button');
            buttonAddElement.classList.add('add');
            buttonAddElement.style.display = 'none';
            const buttonAddI = document.createElement("i");

            buttonAddI.classList.add("material-icons");
            buttonAddI.textContent = "add";

            buttonAddElement.appendChild(buttonAddI)

            const buttonCloseElement = document.createElement('button');
            const buttonI = document.createElement("i");

            buttonI.classList.add("material-icons");
            buttonI.textContent = "keyboard_arrow_up";

            buttonCloseElement.appendChild(buttonI);

            buttonCloseElement.classList.add('close');

            controlsDiv.appendChild(buttonAddElement);
            controlsDiv.appendChild(buttonCloseElement);

            headerDiv.appendChild(h3Element);
            headerDiv.appendChild(controlsDiv);
            msgsDiv.appendChild(headerDiv);

            const bodysection = document.createElement('section');
            bodysection.classList.add('msg-overlay-body');

            buttonAddElement.onclick = function () {
                while (bodysection.hasChildNodes()) {
                    bodysection.firstChild.remove();
                }

                if (add) {
                    makeFriendList(bodysection, res.data.friends);
                    buttonAddI.textContent = "add";
                } else {
                    makeAdd(bodysection, res.data);
                    buttonAddI.textContent = "list";
                }

                add = !add;
            }

            buttonCloseElement.onclick = function () {
                msgsDiv.classList.toggle("msg-overlay-list-bubble-minimized");
                buttonI.textContent = (buttonI.textContent === "keyboard_arrow_up" ? "keyboard_arrow_down" : "keyboard_arrow_up");
                buttonAddElement.style.display = (buttonI.textContent === "keyboard_arrow_up" ? "none" : "block");
            }

            makeFriendList(bodysection, res.data.friends);

            msgsDiv.appendChild(bodysection);
            main.appendChild(asideElement);
        }
    }).catch(res => {
        if (res.response.status === 401) {
            console.log("No Login");
        }
    })
};

function makeFriendList(body, data) {
    if (data.length !== 0) {
        for (const friend of data) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('d-flex', "clickble");

            msgDiv.onclick = (evt) => {
                window.location.href = `/profile?id=${friend.userid}`
            }

            let divImage = document.createElement("div");
            divImage.id = "profileImage";
            divImage.classList.add('rounded-circle', 'flex-shrink-0', 'me-3', 'fit-cover');
            divImage.textContent = friend.name.toLocaleUpperCase().charAt(0);

            msgDiv.appendChild(divImage);

            const innerDiv = document.createElement('div');

            const pElement1 = document.createElement('p');
            pElement1.classList.add('fw-bold', 'text-primary', 'mb-0');
            pElement1.textContent = friend.name;

            const pElement2 = document.createElement('p');
            pElement2.classList.add('text-muted', 'mb-0');
            pElement2.textContent = (new Date(friend.since)).toISOString().split("T")[0];

            innerDiv.appendChild(pElement1);
            innerDiv.appendChild(pElement2);

            msgDiv.appendChild(innerDiv);

            body.appendChild(msgDiv);

            let divider = document.createElement("hr");
            divider.className = "divider";

            body.appendChild(divider);
        }

        body.lastElementChild.remove();

    } else {
        body.appendChild(document.createTextNode("No friends"));
    }
}

function autoComplete(inputValue, data) {
    return new Promise((resolve, reject) => {
        api.get(`/friends/search?s=${inputValue}`)
            .then(res => {
                if (res.status === 200) {
                    resolve(res.data.filter(email => !data.includes(email)));
                }
            })
            .catch(err => reject(err));
    });
}

function makeAdd(body, data) {

    let h4Add = document.createElement("h4");
    h4Add.appendChild(document.createTextNode("Add Friend"));

    body.appendChild(h4Add);

    let input = document.createElement("input");
    let br = document.createElement("br");

    let div = document.createElement("div");
    div.style.marginTop = "10px";

    let sending = false;

    input.addEventListener('input', async ({ target }) => {
        if (!sending) {
            sending = true;
            let dataValue = target.value;
            while (div.hasChildNodes()) {
                div.firstChild.remove();
            }
            if (dataValue.length) {
                let autoCompleteValues = await autoComplete(dataValue, data.friends.map(friend => friend.email));
                autoCompleteValues.forEach(user => {
                    const msgDiv = document.createElement('div');
                    msgDiv.classList.add('d-flex', "clickble");

                    let divImage = document.createElement("div");
                    divImage.id = "profileImage";
                    divImage.classList.add('rounded-circle', 'flex-shrink-0', 'me-3', 'fit-cover');
                    divImage.textContent = user.email.toLocaleUpperCase().charAt(0);

                    msgDiv.appendChild(divImage);

                    const innerDiv = document.createElement('div');

                    const pElement1 = document.createElement('p');
                    pElement1.classList.add('fw-bold', 'text-primary', 'mb-0');
                    pElement1.textContent = user.name;

                    const pElement2 = document.createElement('p');
                    pElement2.classList.add('text-muted', 'mb-0');
                    pElement2.textContent = user.email;

                    innerDiv.appendChild(pElement1);
                    innerDiv.appendChild(pElement2);

                    msgDiv.appendChild(innerDiv);

                    let divider = document.createElement("hr");
                    divider.className = "divider";

                    div.appendChild(msgDiv);
                    div.appendChild(divider);

                    msgDiv.onclick = (evt) => {
                        api.put("/friends/add", { email: user.email }).then(res => {
                            if (res.status === 200) {
                                pElement2.textContent = "Requested Sended";
                                delete msgDiv.onclick;
                                setTimeout(() => {
                                    target.value = "";
                                    msgDiv.previousElementSibling.remove();
                                    msgDiv.remove();
                                }, 2000);
                            } else if (res.status === 216) {
                                pElement2.textContent = res.data;
                            }
                        })
                    }
                });

                div.lastElementChild.remove();

            }
            sending = false;
        }
    });

    div.addEventListener('click', ({ target }) => {
        if (target.tagName === 'LI') {
            input.value = target.textContent;
            ul.innerHTML = ``;
        }
    });

    let divider = document.createElement("hr");
    divider.className = "divider";

    body.appendChild(input);
    body.appendChild(br);
    body.appendChild(div);
    body.appendChild(divider);

    let h4Request = document.createElement("h4");
    h4Request.appendChild(document.createTextNode("Friends Request"));

    body.appendChild(h4Request);

    if (data.friendsRequests.length !== 0) {
        for (const friendsRequest of data.friendsRequests) {

            const msgDiv = document.createElement('div');
            msgDiv.classList.add('d-flex');

            let divImage = document.createElement("div");
            divImage.id = "profileImage";
            divImage.classList.add('rounded-circle', 'flex-shrink-0', 'me-3', 'fit-cover');
            divImage.textContent = friendsRequest.name.toLocaleUpperCase().charAt(0);

            msgDiv.appendChild(divImage);

            const innerDiv = document.createElement('div');
            innerDiv.classList.add('d-flex');

            const leftDiv = document.createElement('div');
            const rightDiv = document.createElement('div');
            rightDiv.className = "d-xl-flex align-items-xl-center";
            rightDiv.style.marginLeft = "20px";

            innerDiv.appendChild(leftDiv);
            innerDiv.appendChild(rightDiv);

            const pElement1 = document.createElement('p');
            pElement1.classList.add('fw-bold', 'text-primary', 'mb-0');
            pElement1.textContent = friendsRequest.name;

            const pElement2 = document.createElement('p');
            pElement2.classList.add('text-muted', 'mb-0');
            pElement2.textContent = (new Date(friendsRequest.timestamp)).toLocaleDateString();

            leftDiv.appendChild(pElement1);
            leftDiv.appendChild(pElement2);
            msgDiv.appendChild(innerDiv);

            let iAccept = document.createElement("i");
            let iReject = document.createElement("i");

            iAccept.className = "material-icons text-success clickble";
            iAccept.textContent = "check";
            iReject.className = "material-icons text-danger clickble";
            iReject.textContent = "clear";

            iAccept.onclick = (evt) => {
                api.post('friends/request/accept', { id: friendsRequest.id })
                    .then(res => {
                        if (res.status === 200) {
                            pElement2.textContent = "Accepted";
                            delete iAccept.onclick;
                            setTimeout(() => {
                                if(msgDiv.previousElementSibling.nodeName === "H4") body.appendChild(document.createTextNode("No friends requests"));
                                msgDiv.remove();
                            }, 2000);
                        }
                    })
            }

            iReject.onclick = (evt) => {
                api.post('friends/request/reject', { id: friendsRequest.id }).then(res => {
                    if (res.status === 200) {
                        pElement2.textContent = "Rejected";
                        delete iReject.onclick;
                        setTimeout(() => {
                            if(msgDiv.previousElementSibling.nodeName === "H4") body.appendChild(document.createTextNode("No friends requests"));
                            msgDiv.remove();
                        }, 2000);
                    }
                })
            }

            rightDiv.appendChild(iAccept);
            rightDiv.appendChild(iReject);

            body.appendChild(msgDiv);
        }
    } else {
        body.appendChild(document.createTextNode("No friends requests"));
    }
}

function deleteChat() {
    let aside = document.querySelector("#msg-overlay");
    if (aside) aside.remove();
}