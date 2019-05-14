var userIds = [];
var currId = "";
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(base64);
};

og_token = getParameterByName('id_token');
token = parseJwt(og_token);
var amIADoctor = false;
var isDoctor = false;

var self_details = null;
const Http7 = new XMLHttpRequest();
Http7.open("GET", 'https://qc1nm97cu7.execute-api.us-east-1.amazonaws.com/beta/user?userid='+token['email']);
Http7.send();
console.log(token['email']);
Http7.onreadystatechange=(e)=>{
  console.log(Http);
  if(Http7.readyState == 4){
    self_details = Http7.responseText;
    if(!self_details || self_details === "") {
      console.log('Empty');
      window.location.replace("register.html#id_token=" + og_token);
    }else {
        console.log(self_details);
        self_details = JSON.parse(self_details);
        amIADoctor = self_details['isDoctor'];
        isDoctor = self_details['isDoctor'];
    }
  }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    console.log(url, name);
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[#&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

if (getParameterByName("otherid")) {
    currId = getParameterByName("otherId");
}

function fillUserDetails(inputJson) {
    console.log("hi");
    var title = document.getElementById('userTitle');
    title.innerHTML = "User";
    var num = inputJson.length;
    doctors = document.getElementById('doctors-list');
    console.log("Number of users:", num);
    if (num === 0) {
        var row = doctors.insertRow(-1);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = "No data available";
        return;
    }

    for (var counter = 0; counter < num; counter++) {
        var row = doctors.insertRow(-1);
        var cell1 = document.createElement('tr');
        var val1 = document.createElement('td');
        val1.setAttribute('style', 'font-size:22px');
        val1.classList.add('name');

        userIds.push(inputJson[counter]['id']);

        var elem = inputJson[counter];
        var currElemId = inputJson[counter]['id'];
        var name = '<a style="color:black" href=messages.html#id_token=' + og_token+ ' class="userDetails" id='+ currElemId +'>' + elem['firstName'] + ' ' + elem['lastName'] + '</a>';
        name = name + '<script> document.getElementById("' + currElemId + '").addEventListener("click", function(){console.log("joo")}); </script>'; 
        
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
var selfId = token['email']; // 'aa4213@columbia.edu'
var url='https://qc1nm97cu7.execute-api.us-east-1.amazonaws.com/beta/doctor?userid=' + selfId;
Http.open("POST", url);
Http.send();
Http.onreadystatechange=(e)=>{
    if (Http.responseText.length > 0 && Http.readyState === 4) {
        console.log('gandu');
        var allUsers = JSON.parse(Http.responseText);
        fillUserDetails(allUsers);
    }
}

var url2 = "wss://7bny2h0qhf.execute-api.us-east-1.amazonaws.com/test?userid=";
url2 = url2 + selfId;
var webSocket = new WebSocket(url2);
webSocket.onopen = function (event) {
    if (messages.length > 0) {
        console.log("Starting sending");
        //message['message'] = "Here's some text that the server is urgently awaiting!";
    }
};

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
};

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

function populateConversation(conversation) {
    var newChatDialog = document.createElement('div');
    newChatDialog.id = 'chat';
    newChatDialog.appendChild(getHelperChatMessageInput());

    var currChatDialog = document.getElementById('chat');
    currChatDialog.replaceWith(newChatDialog);
    messages = [];
    for (var i in conversation) {
        console.log(conversation[i]);
        currMsg = conversation[i]['text'];
        var sentBy = currMsg.split('|||')[0];
        var txt = currMsg.split('|||')[1];
        messages.push({"id": sentBy, "message": txt});
    }

    for (currMsg in messages) displayMessage(messages[currMsg]);
}

function getHelperChatMessageInput() {
    var input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("name", "chat");
    input.id = "chatbox";
    input.setAttribute("placeholder", "Hi there! How can I help you?");
    return input;
}

function getAllMessages() {
    const Http5 = new XMLHttpRequest();
    doc_flag = "0";
    if(amIADoctor){
        doc_flag = "1"
    }

    var url5='https://qc1nm97cu7.execute-api.us-east-1.amazonaws.com/beta/doctor?userid=' + selfId + '&otherid=' + currId + '&isdoctor=' + doc_flag;
    Http5.open("POST", url5);
    Http5.send();
    Http5.onreadystatechange=(e)=>{
        if (Http5.responseText.length > 0 && Http5.readyState === 4) {
            var conversations = JSON.parse(Http5.responseText);
            populateConversation(conversations['messages']);
        }
    }
}
function displayMessage(msg) {
    var currMessage = '';
    var reqId = '';
    if(!msg || msg === undefined) {
        currMessage = messages[messages.length-1]['message'];
        reqId = messages[messages.length-1]['id'];
    }else{
        currMessage = msg['message'];
        reqId = msg['id'];
    }
    var chatElem = document.createElement('p');
    var currId = "chatlog" + messages.length;
    chatElem.id = currId;
    //console.log(messages[messages.length-1]);
    //console.log(selfId);
    if (reqId === selfId) {
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
        displayMessage();
        document.getElementById("chatbox").value = "";
    }
}

document.addEventListener('click', function(e) {
    if (e.target && e.target.className === 'userDetails') {
        var requiredId = e.target.id;
        currId = requiredId;
        getAllMessages();
    }
});

