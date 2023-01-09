if (!api) {
    var api = axios.create({
        baseURL: window.location.origin,
        withCredentials: true,
    });
}


window.onload = function () {

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
            buttonAddElement.textContent = 'Add';

            const buttonCloseElement = document.createElement('button');
            buttonCloseElement.classList.add('close');
            buttonCloseElement.textContent = 'X';
            buttonCloseElement.onclick = function () {
                msgsDiv.classList.toggle("msg-overlay-list-bubble-minimized");
            }

            controlsDiv.appendChild(buttonAddElement)
            controlsDiv.appendChild(buttonCloseElement)

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
                    buttonAddElement.textContent = "Add";
                } else {
                    makeAdd(bodysection, res.data.friendsRequests);
                    buttonAddElement.textContent = "List";
                }

                add = !add;
            }

            makeFriendList(bodysection, res.data.friends);
            //makeAdd(bodysection);

            msgsDiv.appendChild(bodysection);
            main.appendChild(asideElement);
        }
    })
};

function makeFriendList(body, data) {
    if (data.length !== 0) {
        for (const friend of data) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('d-flex');

            const imgElement = document.createElement('img');
            imgElement.classList.add('rounded-circle', 'flex-shrink-0', 'me-3', 'fit-cover');
            imgElement.width = 50;
            imgElement.height = 50;
            imgElement.src = 'https://cdn.bootstrapstudio.io/placeholders/1400x800.png';

            const innerDiv = document.createElement('div');

            const pElement1 = document.createElement('p');
            pElement1.classList.add('fw-bold', 'text-primary', 'mb-0');
            pElement1.textContent = friend.name;

            const pElement2 = document.createElement('p');
            pElement2.classList.add('text-muted', 'mb-0');
            pElement2.textContent = (new Date(friend.since)).toISOString().split("T")[0];

            innerDiv.appendChild(pElement1);
            innerDiv.appendChild(pElement2);
            msgDiv.appendChild(imgElement);
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

function makeAdd(body, data) {

    let input = document.createElement("input");
    let br = document.createElement("br");
    let button = document.createElement("button");

    button.textContent = "Add Friend";

    button.onclick = ev => {
        api.put("/friends/add", { email: input.value }).then(res => {
            console.log(res)
        })
    };

    let divider = document.createElement("hr");
    divider.className = "divider";

    body.appendChild(input);
    body.appendChild(br);
    body.appendChild(button);
    body.appendChild(divider);

    if (data.length !== 0) {
        for (const friendsRequest of data) {

            const msgDiv = document.createElement('div');
            msgDiv.classList.add('d-flex');

            const imgElement = document.createElement('img');
            imgElement.classList.add('rounded-circle', 'flex-shrink-0', 'me-3', 'fit-cover');
            imgElement.width = 50;
            imgElement.height = 50;
            imgElement.src = 'https://cdn.bootstrapstudio.io/placeholders/1400x800.png';

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
            msgDiv.appendChild(imgElement);
            msgDiv.appendChild(innerDiv);

            let iAccept = document.createElement("i");
            let iReject = document.createElement("i");

            iAccept.className = "material-icons text-success clickble";
            iAccept.textContent = "check";
            iReject.className = "material-icons text-danger clickble";
            iReject.textContent = "clear";

            iAccept.onclick = (evt) => {
                api.post('friends/request/accept', { id: friendsRequest.id }).then(res=>{
                    console.log(res.data)
                })
            }

            iReject.onclick = (evt) => {
                api.post('friends/request/reject', { id: friendsRequest.id }).then(res=>{
                    console.log(res.data)
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