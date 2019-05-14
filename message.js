function fillDoctorDetails(inputJson) {
    var num = inputJson.length;
    doctors = document.getElementById('doctors-list');
    if (num === 0) {
        var row = doctors.insertRow(-1);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = "No data available";
        return;
    }

    for (var i = 0; i < num; i++) {
        var row = doctors.insertRow(-1);
        var cell1 = document.createElement('tr');
        var val1 = document.createElement('td');
        val1.setAttribute('style', 'font-size:22px');
        val1.classList.add('name');

        var elem = inputJson[i];
        var name = '<a style="color:black" href=# id='+i+'>' + elem['firstName'] + ' ' + elem['lastName'] + '</a>';
        
        var specialization = '<span style="font-size:15px; font-style:italic">';
        for (var j = 0; j < elem['specialization'].length; j++) {
            specialization = specialization + elem['specialization'][j] + ", ";
        }
        if (specialization.length > 2) specialization = specialization.substr(0, specialization.length - 2);
        specialization = specialization + '</span>';
        var curr_doctor = name + '<br>' + specialization;
        val1.innerHTML = curr_doctor;
        cell1.appendChild(val1);
        row.appendChild(cell1);
    }
}

var messages = [];
var lastMessage = "";

document.onkeypress = keyPress;

//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
    var key = e.keyCode;
    if (key === 13) {
        chatbotResponse();
    }
}

function chatbotResponse() {
    chatbotResponseUtil();
}

function displayMessage(messages) {
    var chatElem = document.createElement('p');
    var currId = "chatlog" + messages.length;
    chatElem.id = currId;
    var currMessage = messages[messages.length-1];
    if (currMessage.startsWith("<b>Doctor</b>")) {
        chatElem.setAttribute("style", "display:block; margin-left:70px; background-color:#eaf0f1;border:1px solid #ccc7c7; border-radius:3px; padding:15px");
    } else {
        chatElem.setAttribute("style", "display:block; margin-right:70px; background-color:#4bc970; border-radius:3px; padding:15px");
    }
    chatElem.innerHTML = currMessage;
    var conversation = document.getElementById('chat');
    conversation.insertBefore(chatElem, conversation.children[conversation.childElementCount-1]);
    document.getElementById("chatbox").value = "";
}

function chatbotResponseUtil() {
    if (document.getElementById("chatbox").value !== "") {
        lastUserMessage = document.getElementById("chatbox").value;
        messages.push(lastUserMessage);
        displayMessage(messages);
        document.getElementById("chatbox").value = "";

        var messageReply = "Doctor's reply here";
        messages.push("<b>Doctor</b>: " + messageReply);
        displayMessage(messages);
    }
}