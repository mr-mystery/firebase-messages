// Realtime Database: https://firemessages-b41f5-default-rtdb.firebaseio.com/
const firebaseConfig = {
    apiKey: "AIzaSyCYre4RH2FESi87HaVMCoYu7mWa7S_1TNQ",
    authDomain: "firemessages-b41f5.firebaseapp.com",
    databaseURL: "https://firemessages-b41f5-default-rtdb.firebaseio.com",
    projectId: "firemessages-b41f5",
    storageBucket: "firemessages-b41f5.appspot.com",
    messagingSenderId: "675067133657",
    appId: "1:675067133657:web:b9432ee0dfaaf67d8fc8c8"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database().ref('Chat');



const allMessages = document.querySelector('#all-messages');
const usernameElem = document.querySelector('#username');
const messageElem = document.querySelector("#message");
const sendButton = document.querySelector('#send-btn');
sendButton.onclick = updateDB;



let NotifP;
Notification.requestPermission().then(perm => { NotifP = perm });

let Show;
let Notif;
document.addEventListener("visibilitychange", () => {
    Show = document.visibilityState;
    if (Notif && Show != "hidden") {Notif.close()};
});



function toggleTheme(t) {
    if (t === "1") {
        allMessages.style['background-color'] = '#36393F';
        allMessages.style['color'] = "#fff";
        usernameElem.style['background-color'] = '#36393F';
        usernameElem.style['color'] = "#fff";
        messageElem.style['background-color'] = '#36393F';
        messageElem.style['color'] = "#fff";
    } else {
        allMessages.style['background-color'] = '#fff';
        allMessages.style['color'] = "#000";
        usernameElem.style['background-color'] = '#fff';
        usernameElem.style['color'] = "#000";
        messageElem.style['background-color'] = '#fff';
        messageElem.style['color'] = "#000";
    };

    if (t === "1") {
        theme = "0";
    } else {
        theme = "1";
    };

    return t;
};
let theme = "1";
if (localStorage.getItem('theme') != null){
    theme = window.localStorage.getItem('theme');
    toggleTheme(theme);
};



if (localStorage.getItem("TabName") != null) {
    document.title = window.localStorage.getItem('TabName');
};
if (localStorage.getItem('TabIcon') != null) {
    document.getElementById('TabIcon').setAttribute('href', window.localStorage.getItem('TabIcon'));
};



function updateDB(event) {
    event.preventDefault();

    let x;

    let data = {
        USERNAME: usernameElem.value,
        MESSAGE: messageElem.value,
    };

    if (data.USERNAME === '' || data.MESSAGE === '') {
        alert('Please enter Username and/or Message');
        return;
    }

    else if (data.MESSAGE.toLowerCase() === '/clear-p128') {
        clear(128);
    }

    else if (data.MESSAGE.includes('/Tab-Icon: ')) {
        x = data.MESSAGE.split("/Tab-Icon: ").pop();
        document.getElementById('TabIcon').setAttribute('href', x);
        window.localStorage.setItem('TabIcon', x);
    }

    else if (data.MESSAGE.includes('/Tab-Name: ')) {
        x = data.MESSAGE.split("/Tab-Name: ").pop();
        document.title = x;
        window.localStorage.setItem('TabName', x);
    }

    else if (data.MESSAGE.toLowerCase() === '/clear-ls') {
        localStorage.clear();
        window.location = "./";
    }

    else if (data.MESSAGE.toLowerCase() === '/theme') {
        window.localStorage.setItem('theme', toggleTheme(theme));
    }

    else {
        console.log(data);
        database.push(data);
    };

    messageElem.value = '';
};



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
        });
    };
};



function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
};



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
    } else {
        messageP = document.createElement('p');
        messageP.innerHTML = messageTxt;
    };

    parentDiv.append(messageP);

    return parentDiv;
};



const form = document.querySelector('form');
form.onkeyup = (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
        updateDB(event);
    };
};



let infoShow = false;
document.getElementById('info-btn').onclick = () => {
    if (infoShow == false) {
        document.getElementById('infoShow').style.display = "block";
        infoShow = true;
    } else {
        document.getElementById('infoShow').style.display = "none";
        infoShow = false;
    };
};



function clear(e) {
    if (e === 128) {
        firebase.database().ref('Chat').remove()
        .then(function () {
            alert("Remove succeeded.");
            let data = {
                USERNAME: 'Server',
                MESSAGE: 'Chat Cleared',
            };
            database.push(data);
        })
        .catch(function (error) {
            alert("Remove failed: " + error.message);
        });
    };
};