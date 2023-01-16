/**
 * Initializes the friends UI element and adds it to the DOM.
 */
function onReadyToMakeFriends() {

    let add = false;

    // Get the main element of the document
    let main = document.querySelector("main");

    // Make an API call to get the friends data
    api.get('/friends').then(res => {
        if (res.status === 200) {
            // Create the aside element that will hold the friends UI
            const asideElement = document.createElement('aside');
            asideElement.id = 'msg-overlay';

            // Create the main div that holds the friends list
            const msgsDiv = document.createElement('div');
            msgsDiv.classList.add('msg-overlay-list-bubble');
            msgsDiv.classList.add("msg-overlay-list-bubble-minimized"); //comentar para inciar maximizado
            asideElement.appendChild(msgsDiv);

            // Create the header div that holds the title and controls
            const headerDiv = document.createElement('div');
            headerDiv.classList.add('msg-overlay-header');

            // Create the h3 element for the title
            const h3Element = document.createElement('h3');
            h3Element.textContent = 'Friends';

            // Create the controls div that holds the add and close buttons
            const controlsDiv = document.createElement('div');
            controlsDiv.classList.add('buttons');
            asideElement.appendChild(msgsDiv);

            // Create the add button
            const buttonAddElement = document.createElement('button');
            buttonAddElement.classList.add('add');
            buttonAddElement.style.display = 'none';
            const buttonAddI = document.createElement("i");

            buttonAddI.classList.add("material-icons");
            buttonAddI.textContent = "add";

            buttonAddElement.appendChild(buttonAddI)

            // Create the close button
            const buttonCloseElement = document.createElement('button');
            const buttonI = document.createElement("i");

            buttonI.classList.add("material-icons");
            buttonI.textContent = "keyboard_arrow_up";

            buttonCloseElement.appendChild(buttonI);

            buttonCloseElement.classList.add('close');

            // Append the add and close buttons to the controls div
            controlsDiv.appendChild(buttonAddElement);
            controlsDiv.appendChild(buttonCloseElement);

            // Append the title and controls to the header div
            headerDiv.appendChild(h3Element);
            headerDiv.appendChild(controlsDiv);
            msgsDiv.appendChild(headerDiv);

            // Create the body section that holds the friends list
            const bodysection = document.createElement('section');
            bodysection.classList.add('msg-overlay-body');

            // Add an event listener to the add button that toggles between the friends list and the add friends form
            buttonAddElement.onclick = function () {
                while (bodysection.hasChildNodes()) {
                    bodysection.firstChild.remove();
                }

                if (add) {
                    // Show the friends list
                    makeFriendList(bodysection, res.data.friends);
                    buttonAddI.textContent = "add";
                } else {
                    // Show the add friends form
                    makeAdd(bodysection, res.data);
                    buttonAddI.textContent = "list";
                }

                add = !add;
            }

            // Add an event listener to the close button that toggles the minimize/maximize state of the friends UI
            buttonCloseElement.onclick = function () {
                msgsDiv.classList.toggle("msg-overlay-list-bubble-minimized");
                buttonI.textContent = (buttonI.textContent === "keyboard_arrow_up" ? "keyboard_arrow_down" : "keyboard_arrow_up");
                buttonAddElement.style.display = (buttonI.textContent === "keyboard_arrow_up" ? "none" : "block");
            }

            // Create the initial friends list
            makeFriendList(bodysection, res.data.friends);

            // Append the body section to the main div
            msgsDiv.appendChild(bodysection);

            // Append the aside element to the main element of the document
            main.appendChild(asideElement);
        }
    })
};
/**
 * Creates a list of friends UI elements and appends them to a given parent element.
 *
 * @param {HTMLElement} body - The parent element that the friends UI elements will be appended to.
 * @param {Array} data - An array of friend objects that contains the data for each friend. Each object should have properties such as `id`, `name`, and `since`.
 */
function makeFriendList(body, data) {
    if (data.length !== 0) {
        // Iterate through the data array
        for (const friend of data) {

            // Create a remove button
            let iRemove = document.createElement("i");

            iRemove.className = "material-icons text-danger clickble";
            iRemove.textContent = "clear";

            // Create the friend UI element
            const msgDiv = createFriendUI({ id: friend.userid, element1: friend.name, element2: (new Date(friend.since)).toLocaleDateString() }, [iRemove]);

            let pElement2 = msgDiv.querySelector("div > p.text-muted.mb-0");

            // Add an event listener to the remove button that makes an API call to remove the friend
            iRemove.onclick = (evt) => {
                api.delete('friends/remove', { data: { id: friend.id } })
                    .then(res => {
                        if (res.status === 200) {
                            pElement2.textContent = "Removed";
                            delete iRemove.onclick;
                            setTimeout(() => {
                                if (msgDiv.parentElement.childElementCount === 1) body.appendChild(document.createTextNode("No friends"));
                                msgDiv.remove();
                            }, 2000);
                        }
                    })
            }

            // Append the friend UI element to the parent element
            body.appendChild(msgDiv);

            // Create a divider element
            let divider = document.createElement("hr");
            divider.className = "divider";

            // Append the divider element to the parent element
            body.appendChild(divider);
        }

        // Remove the last divider
        body.lastElementChild.remove();

    } else {
        // If there are no friends, show a message
        body.appendChild(document.createTextNode("No friends"));
    }
}

/**
 * Makes an API call to search for friends based on a given input value.
 * @param {String} inputValue - The value to search for
 * @param {String[]} data - An array of existing friends
 * @return {Promise<{name: String, email: String}[]>} A promise that resolves with an array of filtered search results, or rejects with an error.
 */
function autoComplete(inputValue, data) {
    return new Promise((resolve, reject) => {
        api.get(`/friends/search?s=${inputValue}`)
            .then(res => {
                if (res.status === 200) {
                    // Filter out existing friends
                    resolve(res.data.filter(obj => !data.includes(obj.email)));
                } else if (code === 215) {
                    resolve([]);
                }
            })
            .catch(err => reject(err));
    });
}

/**
 * Creates the UI for adding friends and appends it to a given parent element.
 * @param {HTMLElement} body - The parent element that the UI will be appended to.
 * @param {Object} data - An object that contains the friends data and friends requests data.
 */
function makeAdd(body, data) {

    //Creates the input for new friend request
    let h4Add = document.createElement("h4");
    h4Add.appendChild(document.createTextNode("Add Friend"));

    body.appendChild(h4Add);

    let input = document.createElement("input");
    let br = document.createElement("br");

    let div = document.createElement("div");
    div.style.marginTop = "10px";

    // create a flag to prevent multiple requests when user is typing
    let sending = false;

    // This event listener listens for when the user inputs something in the input field.
    input.addEventListener('input', async ({ target }) => {
        //Checking if the input event is being sent
        if (!sending) {
            sending = true;
            let dataValue = target.value;
            //Removing all child elements of div
            while (div.hasChildNodes()) {
                div.firstChild.remove();
            }
            if (dataValue.length) {
                //Getting autocomplete values for the input field
                let autoCompleteValues = await autoComplete(dataValue, data.friends.map(friend => friend.email));

                if (autoCompleteValues.length) {
                    autoCompleteValues.forEach(user => {

                        //Create the ui for the search users
                        let divider = document.createElement("hr");
                        divider.className = "divider";

                        let msgDiv = createFriendUI({ element1: user.name, element2: user.email }, [])

                        msgDiv.classList.add("clickble");

                        let pElement2 = msgDiv.querySelector("div > p.text-muted.mb-0");

                        div.appendChild(msgDiv);
                        div.appendChild(divider);

                        // Send a request to the server to add a friend when clicked on the created element
                        msgDiv.onclick = (evt) => {
                            api.post("/friends/add", { email: user.email }).then(res => {
                                if (res.status === 200) {
                                    pElement2.textContent = "Requested Sended";
                                    delete msgDiv.onclick;
                                    setTimeout(() => {
                                        target.value = "";
                                        while (div.hasChildNodes()) {
                                            div.firstChild.remove();
                                        }
                                    }, 2000);
                                } else if (res.status === 216) {
                                    pElement2.textContent = res.data;
                                }
                            })
                        }
                    });

                    div.lastElementChild.remove();
                }
            }
            sending = false;
        }
    });

    let divider = document.createElement("hr");
    divider.className = "divider";

    body.appendChild(input);
    body.appendChild(br);
    body.appendChild(div);
    body.appendChild(divider);

    //Friends Request
    let h4Request = document.createElement("h4");
    h4Request.appendChild(document.createTextNode("Friends Request"));

    body.appendChild(h4Request);

    //Creates the ui for friend request
    if (data.friendsRequests.length !== 0) {
        for (const friendsRequest of data.friendsRequests) {

            let iAccept = document.createElement("i");
            let iReject = document.createElement("i");

            iAccept.className = "material-icons text-success clickble";
            iAccept.textContent = "check";
            iReject.className = "material-icons text-danger clickble";
            iReject.textContent = "clear";

            let msgDiv = createFriendUI({ element1: friendsRequest.name, element2: (new Date(friendsRequest.timestamp)).toLocaleDateString() }, [iAccept, iReject])

            let pElement2 = msgDiv.querySelector("div > p.text-muted.mb-0");

            //Accepts the friend request
            iAccept.onclick = (evt) => {
                api.post('friends/request/accept', { id: friendsRequest.id })
                    .then(res => {
                        if (res.status === 200) {
                            pElement2.textContent = "Accepted";
                            delete iAccept.onclick;
                            setTimeout(() => {
                                if (msgDiv.previousElementSibling.nodeName === "H4") body.appendChild(document.createTextNode("No friends requests"));
                                msgDiv.remove();
                            }, 2000);
                        }
                    })
            }

            //Reject the friend request
            iReject.onclick = (evt) => {
                api.post('friends/request/reject', { id: friendsRequest.id }).then(res => {
                    if (res.status === 200) {
                        pElement2.textContent = "Rejected";
                        delete iReject.onclick;
                        setTimeout(() => {
                            if (msgDiv.previousElementSibling.nodeName === "H4") body.appendChild(document.createTextNode("No friends requests"));
                            msgDiv.remove();
                        }, 2000);
                    }
                })
            }


            body.appendChild(msgDiv);
        }
    } else {
        body.appendChild(document.createTextNode("No friends requests"));
    }
}

/**
 * Deletes the chat element from the DOM.
 */
function deleteChat() {
    // Get the chat element
    let aside = document.querySelector("#msg-overlay");
    // Check if the chat element exists
    if (aside) {
        // Remove the chat element from the DOM
        aside.remove();
    }
}

/**
 * Creates a UI element for a friend that contains a profile image and some text information.
 *
 * @param {{id: Number, element1: String, element2: String}} element - An object that contains `element1` and `element2` properties, which are used to create text elements in the UI.
 * @param {HTMLElement[]} childsRightArray - An array of child elements that will be appended to the right side of the UI.
 * @return {HTMLElement} - The created friend UI element.
 */
function createFriendUI(element, childsRightArray) {
    // Create a div element to hold the friend information
    const friendDiv = document.createElement('div');
    friendDiv.classList.add('d-flex');

    // Create a div element to hold the profile image
    let divImage = document.createElement("div");
    divImage.classList.add('rounded-circle', 'flex-shrink-0', 'me-3', 'fit-cover', "profileImage");
    divImage.textContent = element.element1.toLocaleUpperCase().charAt(0);

    // Append the profile image div to the friend div
    friendDiv.appendChild(divImage);

    // Create a div element to hold the inner content
    const innerDiv = document.createElement('div');
    innerDiv.classList.add('d-flex');

    // Create left and right divs to hold the content
    const leftDiv = document.createElement('div');

    // Append the left and right divs to the inner div
    innerDiv.appendChild(leftDiv);

    // Create p elements for element1 and element2
    const pElement1 = document.createElement('p');
    pElement1.classList.add('fw-bold', 'text-primary', 'mb-0');
    pElement1.textContent = element.element1;

    const pElement2 = document.createElement('p');
    pElement2.classList.add('text-muted', 'mb-0');
    pElement2.textContent = element.element2;

    // Append the p elements to the left div
    leftDiv.appendChild(pElement1);
    leftDiv.appendChild(pElement2);
    friendDiv.appendChild(innerDiv);

    if (childsRightArray.length) {
        const rightDiv = document.createElement('div');
        rightDiv.className = "d-xl-flex align-items-xl-center";
        rightDiv.style.marginLeft = "20px";


        // Append the child elements to the right div
        for (const innerHTMEle of childsRightArray) {
            rightDiv.appendChild(innerHTMEle);
        }

        innerDiv.appendChild(rightDiv);
    }

    if (element.id) {
        divImage.onclick = (evt) => {
            window.location.href = `/profile?id=${element.id}`
        }

        pElement1.onclick = (evt) => {
            window.location.href = `/profile?id=${element.id}`
        }
    }

    // Return the friend div
    return friendDiv;
}
