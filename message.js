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

function chatbotResponseUtil() {
    if (document.getElementById("chatbox").value !== "") {
        lastUserMessage = document.getElementById("chatbox").value;
        messages.push(lastUserMessage);
        document.getElementById("chatbox").value = "";
    }	
    var messageReply = "Doctor's reply here";
    messages.push("<b>Doctor</b>: " + messageReply);
    for (var i = 1; i < 8; i++) {
        if (messages[messages.length - i]) {
            var currId = "chatlog" + i;
            var chatElem = document.getElementById(currId);
            var currMessage = messages[messages.length - i];
            if (currMessage.startsWith("<b>Doctor</b>")) {
                chatElem.setAttribute("style", "margin-left:60px; background-color:#eaf0f1;border:1px solid #ccc7c7; border-radius:3px; padding:5px");
            } else {
                chatElem.setAttribute("style", "margin-right:60px; background-color:#d5e0e2;border:1px solid #ccc7c7; border-radius:3px; padding:5px");
            }
            chatElem.innerHTML = currMessage;
        }
    }
}