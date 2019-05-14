var userIds = [];

function fillUserDetails(inputJson) {
    var title = document.getElementById('userTitle');
    title.innerHTML = "User";
    var num = inputJson.length;
    doctors = document.getElementById('doctors-list');
    if (num === 0) {
        var row = doctors.insertRow(-1);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = "No data available";
        return;
    }
    var isDoctor = false;

    for (var counter = 0; counter < num; counter++) {
        var row = doctors.insertRow(-1);
        var cell1 = document.createElement('tr');
        var val1 = document.createElement('td');
        val1.setAttribute('style', 'font-size:22px');
        val1.classList.add('name');

        if (inputJson[counter]['isDoctor'] === true) isDoctor = true;
        userIds.push(inputJson[counter]['id']);

        var elem = inputJson[counter];
        var name = '<a style="color:black" href=# id='+ counter +'>' + elem['firstName'] + ' ' + elem['lastName'] + '</a>';
        name = name + '<script> document.getElementById("' + counter + '".addEventListener("click", function(){console.log("joo")}); </script>'; 
        var specialization = "";
        if ((elem['specialization'] != undefined) && (elem['specialization'].length > 0)) {
            specialization = '<span style="font-size:15px; font-style:italic">';
            for (var j = 0; j < elem['specialization'].length; j++) {
                specialization = specialization + elem['specialization'][j] + ", ";
            }
            if (specialization.length > 2) {
                specialization = specialization.substr(0, specialization.length - 2);
            }
            specialization = specialization + '</span>';
        }
        var curr_user = name + '<br>' + specialization;
        val1.innerHTML = curr_user;
        cell1.appendChild(val1);
        row.appendChild(cell1);
    }
    if (isDoctor) title.innerHTML = "Patients";
    else title.innerHTML = "Doctors";
}

//message = {"action" : "onMessage" , "message" : "working firse"};
var messages = [];
var lastMessage = "";

const Http = new XMLHttpRequest();
var selfId = window.sessionStorage['username']; // 'aa4213@columbia.edu'
var url='https://qc1nm97cu7.execute-api.us-east-1.amazonaws.com/beta/doctor?userid=' + selfId;
Http.open("POST", url);
Http.send();
Http.onreadystatechange=(e)=>{
    if (Http.responseText.length > 0 && Http.readyState === 4) {
        var conversations = JSON.parse(Http.responseText);
        fillUserDetails(conversations);
    }
}

var userId = window.sessionStorage["username"];
var url2 = "wss://7bny2h0qhf.execute-api.us-east-1.amazonaws.com/test?userid=";
url2 = url2 + userId;
var webSocket = new WebSocket(url2);
webSocket.onopen = function (event) {
    if (messages.length > 0) {
        console.log("Starting sending");
        //message['message'] = "Here's some text that the server is urgently awaiting!";
    }
};

var curr_id = "";

webSocket.onmessage = function (event) {
    console.log(event.data);
    var info = event.data;
    if (info.startsWith("Echo:")) {
        info = info.split(":")[1];
        info = info.substring(1);
        var details = info.split("|||");
        curr_id = details[0];
        var curr_message = details[1];
        messages.push({"id": curr_id, "message": curr_message});
        displayMessage();
    }
}

function sendMessage() {
    var currMessage = selfId + "|||" + messages[messages.length-1]['message'];
    var userMessage = {
        "action" : "onMessage",
        "receiver_id": currId,
        "sender_id": selfId,
        "sentByDoctor":"1",
        "message" : currMessage
    }
    webSocket.send(JSON.stringify(userMessage)); 
    console.log("Sent");
}

document.onkeypress = keyPress;

//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
    var key = e.keyCode;
    if (key === 13) {
        myResponseUtil();
        sendMessage();
    }
}

function displayMessage() {
    var chatElem = document.createElement('p');
    var currId = "chatlog" + messages.length;
    chatElem.id = currId;
    var currMessage = messages[messages.length-1]['message'];
    console.log(messages[messages.length-1]);
    console.log(selfId);
    if (messages[messages.length-1]['id'] === selfId) {
        chatElem.setAttribute("style", "display:block; margin-left:70px; background-color:#eaf0f1;border:1px solid #ccc7c7; border-radius:3px; padding:15px");
    } else {
        chatElem.setAttribute("style", "display:block; margin-right:70px; background-color:#4bc970; border-radius:3px; padding:15px");
    }
    chatElem.innerHTML = currMessage;
    var conversation = document.getElementById('chat');
    conversation.insertBefore(chatElem, conversation.children[conversation.childElementCount-1]);
    document.getElementById("chatbox").value = "";
}

function myResponseUtil() {
    if (document.getElementById("chatbox").value !== "") {
        lastUserMessage = document.getElementById("chatbox").value;
        messages.push({'id': selfId, 'message': lastUserMessage});
        displayMessage(messages);
        document.getElementById("chatbox").value = "";
    }
}