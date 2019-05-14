const REGION = "us-east-1";
var medical_api_token = "";

$(window).scroll(function(){
    if ($(window).scrollTop() >= 300) {
        $('nav').addClass('fixed-header');
        $('nav div').addClass('visible-title');
    }
    else {
        $('nav').removeClass('fixed-header');
        $('nav div').removeClass('visible-title');
    }
});

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

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(base64);
};

og_token = getParameterByName('id_token');
token = parseJwt(og_token);
console.log(token);
var response = null;
window.sessionStorage.setItem("token", og_token);
window.sessionStorage.setItem("username", token['email']);

const Http = new XMLHttpRequest();
const url='https://qc1nm97cu7.execute-api.us-east-1.amazonaws.com/beta/user?userid='+token['email'];
Http.open("GET", url);
Http.send();
console.log(token['email']);
Http.onreadystatechange=(e)=>{
  console.log(Http);
  if(Http.readyState == 4){
    response = Http.responseText;
    if(!response || response === "[]") {
      console.log('Empty');
      window.location.replace("register.html#id_token=" + og_token);
    }else {
        console.log(response);
        response = JSON.parse(response);
    }
  }
}

var params = {
  // This is where any modeled request parameters should be added.
  // The key is the parameter name, as it is defined in the API in API Gateway.
};

my_data = []

function init() {
  var uri = "https://authservice.priaid.ch/login";
  var api_key = "b5WGs_GMAIL_COM_AUT";
  var secret_key = "m2R4PxEp56StLw37W";
  var computedHash = CryptoJS.HmacMD5(uri, secret_key);
  var computedHashString = computedHash.toString(CryptoJS.enc.Base64); 

  const Http1 = new XMLHttpRequest();
  Http1.open("POST", uri);
  Http1.setRequestHeader("Authorization", "Bearer " + api_key + ":" + computedHashString)
  Http1.send();
  Http1.onreadystatechange=(e)=>{
    medical_api_token = JSON.parse(Http1.responseText);
    medical_api_token = medical_api_token['Token'];
    const Http = new XMLHttpRequest();
    const url = 'https://healthservice.priaid.ch/symptoms?token=' + medical_api_token + '&format=json&language=en-gb';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange=(e)=>{
      str = Http.responseText.replace(new RegExp('Name', 'g'), 'text');
      str = str.replace(new RegExp('ID','g'), 'id');
      my_data = JSON.parse(str);
      var test2 = $('#test2');
      $(test2).select2({
          data:my_data,
          placeholder: 'Select from the list of options',
          multiple: true
      });
    };
  }; 

};

init();

var body = {
  // This is where you define the body of the request,
};

var additionalParams = {
  // If there are any unmodeled query parameters or headers that must be
  //   sent with the request, add them here.
  headers: {
    "Access-Control-Allow-Origin" : '*',
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": '*',
    "Access-Control-Allow-Headers": '*'
  }
};

var apigClient = apigClientFactory.newClient({
  apiKey: 'v6yONPje7AdEv9jui3Fu35uPMHuuFww419uYp39a'
});

function submitSymptom() {
  const Http = new XMLHttpRequest();
  var gender = 'female';
  var age = response['age'];
  symptoms = '';
  sel = selections;
  if(selections == null) {
      sel = alt_sel;
  } 

  sel = JSON.parse(sel);
  console.log(sel);
  for(var i=0;i<sel.length;i++) {
    if(i==0){
        symptoms = sel[i]["id"];
    }else {
        symptoms = symptoms + ',' +  sel[i]["id"];
    }
  }
  gender = 'female'
  if('gender' in response) {
    gender = response['gender'];
  }

  symptoms = '[' + symptoms + ']'
  data = {
    symptoms : symptoms,
    gender : response['gender'],
    age : age
  };
  console.log(data);
  const url = 'https://qc1nm97cu7.execute-api.us-east-1.amazonaws.com/beta/doctor?age=' + age + '&gender='  + gender + '&symptoms=' + symptoms
  Http.open("GET", url);
  Http.send();
  Http.onreadystatechange=(e)=>{
    dat = Http.responseText;
    console.log(dat);
    data = {
      body : dat, 
      userData : response
    };
    //Now redirect to doctorResults.html
    window.location = "doctorResults.html?response=" + btoa(JSON.stringify(dat))+"#id_token=" + getParameterByName('id_token');
  };

};
var selections = null;
var alt_sel = null;

$(test2).change(function() {
    alt_sel = ( JSON.stringify($(test2).select2('data')) );
    $('#selectedText').text(alt_sel);
});

function sendMessage(e) {
  e.preventDefault();
  var a = $("<div class='outgoing_msg'><div class='sent_msg'><p>" + $('#userMsg').val() + "</p></div></div>");
  $("#m_his").append(a);
  body = {
  // This is where you define the body of the request,
      "userMessage": $('#userMsg').val()
  };
  apigClient.chatbotPost(params, body, additionalParams)
    .then(function(data){
        resp = JSON.parse(data['data']['body']);
        // Add success callback code here.
        $("#userMsg").val("");
        var a = $("<div class='incoming_msg'><div class='incoming_msg_img'><img src='img/icon.jpg'></div><div class='received_msg'><p>" + resp['message'] + "</p></div></div></div>");
        $("#m_his").append(a); 
        console.log(resp['message']);
        if(resp['message'] === "Please provide your symptoms  below : ") {
          b = '<div><select id="test" style="display: inline-block;position: relative;right: 0" ></select></div><div><button class="sub_but" id = "sub_but" onclick="submitSymptom()"><i class="fa fa-paper-plane-o\"></i></button></div>';
          b =b + '<script>var test = $(\'#test\');$(test).select2({data:my_data,placeholder: "Select from the list of options",multiple: true});';
          b = b+ '$(test).change(function() {selections = ( JSON.stringify($(test).select2(\'data\')) );$(\'#selectedText\').text(selections);});';
          $("#m_his").append(b);
        }

    }).catch( function(result){
        // Add error callback code here.
        console.log(result);
    });
}
// Get the input field
var input = document.getElementById("userMsg");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("msg_send").click();
  }
});





$('document').ready(function() {
    $('#msg_send').click(function(e) {
        sendMessage(e);
    });
}); 