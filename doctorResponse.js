function getParameterByName(name, pat) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[' + pat + '&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
// Decode String from Base64 Enconding
function decodeBase64(encodedValue) {
    return CryptoJS.enc.Base64.stringify(encodedValue);
};

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(base64);
};

function fillDiagnosis() {
	doctorDat = atob(getParameterByName('response','?'));
	doctorDat = JSON.parse(JSON.parse(doctorDat));

	userDat = parseJwt(getParameterByName('id_token','#'));
	inputJson = doctorDat['diagnosis'];
    var num = inputJson.length;
    diag = document.getElementById('diagnosis-list');
    if (num === 0) {
        var row = diag.insertRow(-1);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = "No data available";
        return;
    }
    var i = 0;
    for (elem in inputJson) {
        var row = diag.insertRow(-1);
        var cell1 = document.createElement('tr');
        var val1 = document.createElement('td');
        val1.setAttribute('style', 'font-size:22px');
        val1.classList.add('name');

        var name = '<p style="color:black" id='+i+'>' + inputJson[elem]  + '</p>';
        
        var curr_diag = name;
        val1.innerHTML = curr_diag;
        cell1.appendChild(val1);
        row.appendChild(cell1);
        i = i + 1;

    }
}

function fillDoctorDetails() {
	doctorDat = atob(getParameterByName('response','?'));
	doctorDat = JSON.parse(JSON.parse(doctorDat));

	userDat = parseJwt(getParameterByName('id_token','#'));
	inputJson = doctorDat['refer'];
	console.log(userDat);
	console.log(doctorDat);
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
        var name = '<a style="color:black" id='+i+'>' + elem['firstName'] + ' ' + elem['lastName'] + '</a>';
        
        var specialization = '<span style="font-size:15px; font-style:italic">';
        for (var j = 0; j < elem['specialization'].length; j++) {
            specialization = specialization + elem['specialization'][j] + ", ";
        }
        if (specialization.length > 2) specialization = specialization.substr(0, specialization.length - 2);
        specialization = specialization + '</span>';
        var contact = "<a class='contact' id='" + elem['id'] + "' href='javascript:void(0);'>Contact now.</a>";
        var curr_doctor = name + '<br>' + specialization + '<br>' + contact ;

        val1.innerHTML = curr_doctor;
        cell1.appendChild(val1);
        row.appendChild(cell1);
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

function sendMessage(msg) {
    var currMessage = selfId + "|||" + msg['message'];
    var userMessage = {
        "action" : "onMessage",
        "receiver_id": msg['id'],
        "sender_id": token['email'],
        "sentByDoctor":"1",
        "message" : currMessage
    }
    webSocket.send(JSON.stringify(userMessage)); 
    console.log("Sent");
}


const Http8 = new XMLHttpRequest();
var selfId = token['email']; // 'aa4213@columbia.edu'
var url='https://qc1nm97cu7.execute-api.us-east-1.amazonaws.com/beta/doctor?userid=' + selfId;
Http8.open("POST", url);
Http8.send();
var allUsers = [];
Http8.onreadystatechange=(e)=>{
    if (Http8.responseText.length > 0 && Http8.readyState === 4) {
        allUsers = JSON.parse(Http8.responseText);
    }
}


document.addEventListener('click', function(e) {
    email = token['email']
    if (e.target && e.target.className === 'contact') {
        var requiredId = e.target.id;
        otherid = requiredId;
        selfId = token['email'];
        if(otherid && allUsers.includes(otherid)==false) {
            var msg =  {"id" : otherid, "message" : "Hello I am not feeling too well!"};
            sendMessage(msg);
        }
        setTimeout(function(){}, 5000);

        window.location.replace('messages.html?userid=' + email + '&otherid=' + otherid +'&isDoctor=false#id_token=' + getParameterByName('id_token','#'));
    }
});


