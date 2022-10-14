const database = firebase.database().ref('Chat');



let NotifP
Notification.requestPermission().then(perm => { NotifP = perm })

let Show
let Notif
document.addEventListener("visibilitychange", () => {
    Show = document.visibilityState
    if (Notif && Show != "hidden") Notif.close()
})



const allMessages = document.querySelector('#all-messages');
const usernameElem = document.querySelector('#username');
const messageElem = document.querySelector("#message");
const sendButton = document.querySelector('#send-btn');
sendButton.onclick = updateDB;
// document.querySelector('#send-btn').onclick = updateDB



if (localStorage.getItem("TabName") != null) {
    document.title = window.localStorage.getItem('TabName');
}
if (localStorage.getItem('TabIcon') != null) {
    document.getElementById('TabIcon').setAttribute('href', window.localStorage.getItem('TabIcon'));
}



function updateDB(event) {
    event.preventDefault();

    let x;

    let data = {
        USERNAME: usernameElem.value,
        MESSAGE: messageElem.value,
    }

    if (data.USERNAME === '' || data.MESSAGE === '') {
        alert('Please enter Username and/or Message');
    }

    else if (data.MESSAGE === "Clear: P128") {
        clear(data.MESSAGE);
        
        messageElem.value = '';
    }

    else if (data.MESSAGE.includes('Tab-Icon: ') === true) {
        x = data.MESSAGE.split("Tab-Icon: ").pop();
        document.getElementById('TabIcon').setAttribute('href', x);

        window.localStorage.setItem('TabIcon', x);

        messageElem.value = '';
    }

    else if (data.MESSAGE.includes('Tab-Name: ') === true) {
        x = data.MESSAGE.split("Tab-Name: ").pop();
        document.title = x;

        window.localStorage.setItem('TabName', x);

        messageElem.value = '';
    }

    else if (data.MESSAGE === 'Clear-LS') {
        localStorage.clear();

        messageElem.value = '';
    }

    else {
        console.log(data);

        database.push(data);

        messageElem.value = '';
    }
}



database.on('child_added', addMessageToBoard);



function addMessageToBoard(rowData) {
    console.log(rowData);

    let data = rowData.val();

    console.log(data);

    let singleMessage = makeSingleMessageHTML(data.USERNAME, data.MESSAGE);
    allMessages.append(singleMessage);
    
    if (NotifP === "granted" && Show === "hidden") {

        Notif = new Notification(data.USERNAME, {
            body: data.MESSAGE,
            tag: "newM",
        })
    }
}



function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}



function makeSingleMessageHTML(usernameTxt, messageTxt) {
    let parentDiv = document.createElement('div');
    parentDiv.setAttribute('class', 'single-message');

    let usernameP = document.createElement('p');
    usernameP.classList.add('single-message-username');
    usernameP.innerHTML = usernameTxt + ':';
    parentDiv.append(usernameP);

    let messageP;

    if (isImage(messageTxt) === true) {
        messageP = document.createElement('img');
        messageP.src = messageTxt;
    }
    else {
        messageP = document.createElement('p');
        messageP.innerHTML = messageTxt;
    }

    parentDiv.append(messageP);

    return parentDiv;
}



const form = document.querySelector('form');
form.onkeyup = (event) => {
    event.preventDefault();

    if (event.keyCode === 13) {
        updateDB(event);
    }
}



let infoShow = false;
document.getElementById('info-btn').onclick = () => {
    if (infoShow == false) {
        document.getElementById('infoShow').style.display = "block";
        infoShow = true;
    }
    else {
        document.getElementById('infoShow').style.display = "none";
        infoShow = false;
    }
}



function clear(e) {
    if (e === 128 || e === 'Clear: P128') {
        
        firebase.database().ref('Chat').remove()
            
        .then(function () {
                alert("Remove succeeded.");
                let data = {
                    USERNAME: 'Server',
                    MESSAGE: 'Chat Cleared',
                }
                database.push(data);
            })
            
            .catch(function (error) {
                alert("Remove failed: " + error.message);
            })
    }
}