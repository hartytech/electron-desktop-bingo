// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote;

const firebase = require('firebase');

const type = "Four Corners"

const firebaseConfig = {
    apiKey: "AIzaSyCx86ET3fQ6W7S48iR56pam5e1j9HiBu7U",
    authDomain: "bingo-9abb7.firebaseapp.com",
    databaseURL: "https://bingo-9abb7-default-rtdb.firebaseio.com",
    projectId: "bingo-9abb7",
    storageBucket: "bingo-9abb7.appspot.com",
    messagingSenderId: "614858550688",
    appId: "1:614858550688:web:2711bb059a4f15c9a3c8c5",
    measurementId: "G-1ZDSK90TDE"
  }

  firebase.initializeApp(firebaseConfig);

  var userStatusDatabaseRef = firebase.database().ref('/status/bingo');

// We'll create two constants which we will write to 
// the Realtime database when this device is offline
// or online.
var isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
    value: null,
};

var isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
    value: null,
    type: type,
};

// Create a reference to the special '.info/connected' path in 
// Realtime Database. This path returns `true` when connected
// and `false` when disconnected.
firebase.database().ref('.info/connected').on('value', function(snapshot) {
    // If we're not currently connected, don't do anything.
    if (snapshot.val() == false) {
        return;
    };

    // If we are currently connected, then use the 'onDisconnect()' 
    // method to add a set which will only trigger once this 
    // client has disconnected by closing the app, 
    // losing internet, or any other means.
    userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
        // The promise returned from .onDisconnect().set() will
        // resolve as soon as the server acknowledges the onDisconnect() 
        // request, NOT once we've actually disconnected:
        // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

        // We can now safely set ourselves as 'online' knowing that the
        // server will mark us as offline once we lose connection.
        userStatusDatabaseRef.set(isOnlineForDatabase);
    });
});

// Create a reference to this user's specific status node.
// This is where we will store data about being online/offline.

const win = remote.getCurrentWindow(); /* Note this is different to the
html global `window` variable */

var values = [];
var called = [];



// When document has loaded, initialise
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};

window.onload = (event) => {
    console.log('page is fully loaded');
    document.getElementById("button").onclick = function () { start(); };
  };

window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}

function handleWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        win.minimize();
    });

    document.getElementById('max-button').addEventListener("click", event => {
        win.maximize();
    });

    document.getElementById('restore-button').addEventListener("click", event => {
        win.unmaximize();
    });

    document.getElementById('close-button').addEventListener("click", event => {
        win.close();
    });

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    }
}
function start() {
    document.getElementById("button").innerText = "NEXT";
    document.getElementById("button").onclick = function () { next(); };
    document.getElementById("B").innerHTML = "";
    document.getElementById("I").innerHTML = "";
    document.getElementById("N").innerHTML = "";
    document.getElementById("G").innerHTML = "";
    document.getElementById("O").innerHTML = "";
    values = [];
    called = [];
    for (var i = 0; i<75; i++) {
        var a = i+1;
        var string;
        if (a<76 && a>60) {
            string = "O" + a;
            values.push(string);
        }
        else if (a<61 && a>45) {

        }
        else if (a<46 && a>30) {

        }
        else if (a<31 && a>15) {

        }
        else {
            string = "B" + a;
            values.push(string);
        }
        
    }
    var a = Math.ceil(Math.random()*values.length);
    a = values[a-1];
    var string = "";
    if (a.substring(0,1) == "O") {
        string = a;
        called.push(string);
        document.getElementById("O").innerHTML += "<p>" + string + "</p>";
    }
    else if (a.substring(0,1) == "G") {
        string = a;
        called.push(string);
        document.getElementById("G").innerHTML += "<p>" + string + "</p>";
    }
    else if (a.substring(0,1) == "N") {
        string = a;
        called.push(string);
        document.getElementById("N").innerHTML += "<p>" + string + "</p>";
    }
    else if (a.substring(0,1) == "I") {
        string = a;
        called.push(string);
        document.getElementById("I").innerHTML += "<p>" + string + "</p>";
    }
    else {
        string = a;
        called.push(string);
        document.getElementById("B").innerHTML += "<p>" + string + "</p>";
    }
    values.splice(values.indexOf(string), 1);
    console.log(called);
    document.getElementById("number-text").innerText = string;
    var isOnlineForDatabaseUpdate = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
        value: string,
        called: called,
        type: type,
    };
    userStatusDatabaseRef.set(isOnlineForDatabaseUpdate);
}

function next() {
    console.log("next");
    if(values.length != 0) {
        var a = Math.ceil(Math.random()*values.length);
        a = values[a-1];
        var string = "";
        if (a.substring(0,1) == "O") {
            string = a;
            called.push(string);
            document.getElementById("O").innerHTML += "<p>" + string + "</p>";
        }
        else if (a.substring(0,1) == "G") {
            string = a;
            called.push(string);
            document.getElementById("G").innerHTML += "<p>" + string + "</p>";
        }
        else if (a.substring(0,1) == "N") {
            string = a;
            called.push(string);
            document.getElementById("N").innerHTML += "<p>" + string + "</p>";
        }
        else if (a.substring(0,1) == "I") {
            string = a;
            called.push(string);
            document.getElementById("I").innerHTML += "<p>" + string + "</p>";
        }
        else {
            string = a;
            called.push(string);
            document.getElementById("B").innerHTML += "<p>" + string + "</p>";
        }
        values.splice(values.indexOf(string), 1);
        document.getElementById("number-text").innerText = string;
    }
    else {
        document.getElementById("number-text").innerText = "END";
        string="END";
    }
    console.log(called);
    var isOnlineForDatabaseUpdate = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
        value: string,
        called: called,
        type: type,
    };
    userStatusDatabaseRef.set(isOnlineForDatabaseUpdate);
}

function stop() {
    remote.getCurrentWindow().webContents.loadFile('./index.html');
    
}