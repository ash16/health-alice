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

const Http = new XMLHttpRequest();
const url='https://qc1nm97cu7.execute-api.us-east-1.amazonaws.com/beta/user?userid='+token['email'];
Http.open("GET", url);
Http.send();
Http.onreadystatechange=(e)=>{
    response = Http.responseText;
    if(response.size==0) {
        window.sessionStorage.setItem("token", og_token);
        window.sessionStorage.setItem("username", token['email'])
            window.location.replace("register.html#id_token=" + og_token);
    }else {
        console.log(response);
        response = JSON.parse(response);
    }
}

var params = {
  // This is where any modeled request parameters should be added.
  // The key is the parameter name, as it is defined in the API in API Gateway.
};

my_data = []

function init() {
  var uri = "https://authservice.priaid.ch/login";
  var api_key = "n3A9J_GMAIL_COM_AUT";
  var secret_key = "Ft3q8C2MyWw4j5BAr";
  var computedHash = CryptoJS.HmacMD5(uri, secret_key);
  var computedHashString = computedHash.toString(CryptoJS.enc.Base64); 

  const Http1 = new XMLHttpRequest();
  Http1.open("POST", uri);
  Http1.setRequestHeader("Authorization", "Bearer " + api_key + ":" + computedHashString)
  Http1.send();
  Http1.onreadystatechange=(e)=>{
    medical_api_token = JSON.parse(Http1.responseText);
    medical_api_token = medical_api_token['Token'];
    console.log(medical_api_token);
    const Http = new XMLHttpRequest();
    const url = 'https://healthservice.priaid.ch/symptoms?token=' + medical_api_token + '&format=json&language=en-gb';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange=(e)=>{
      str = Http.responseText.replace(new RegExp('Name', 'g'), 'text');
      str = str.replace(new RegExp('ID','g'), 'id');
      my_data = JSON.parse(str);
      var test = $('#test');
      var test2 = $('#test2');
      $(test).select2({
          data:my_data,
          placeholder: 'Select from the list of options',
          multiple: true
      });
      $(test2).select2({
          data:my_data,
          placeholder: 'Select from the list of options',
          multiple: true
      });
    };
    //document.getElementById('test').setAttribute('style', 'background: #4bc970');
    //document.getElementById('test2').setAttribute('style', 'background: #4bc970');
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
  const gender = 'female';
  const age = response['age'];
  symptoms = '';
  selections = JSON.parse(selections);
  for(var i=0;i<selections.length;i++) {
    if(i==0){
        symptoms = selections[i]["id"];
    }else {
        symptoms = symptoms + ',' +  selections[i]["id"];
    }
  }
  const url = 'https://healthservice.priaid.ch/diagnosis?symptoms=[' + symptoms + ']&gender=' + gender + '&year_of_birth=' + age +'&token='+ medical_api_token;
  console.log(url);
  Http.open("GET", url);
  Http.send();
  Http.onreadystatechange=(e)=>{
    str = Http.responseText;
    console.log('suks');
    console.log(str);
  };

};
var selections = null;
$(test).change(function() {
    selections = ( JSON.stringify($(test).select2('data')) );
    console.log('Selected options: ' + selections);
    $('#selectedText').text(selections);
});

$('document').ready(function() {
    $('#msg_send').click(function(e) {
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

                //console.log(data["data"]["response"]);

                // $('#botResponse').val(data["data"]["response"]);
            }).catch( function(result){
                // Add error callback code here.
                console.log(result);
            });
    });
}); 