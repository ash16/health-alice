const REGION = "us-west-2";
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
        window.location.replace("register.html#id_token=" + og_token);
    }else {
        response = JSON.parse(response);
    }
}

var params = {
  // This is where any modeled request parameters should be added.
  // The key is the parameter name, as it is defined in the API in API Gateway.
};

my_data = []

function init() {
  const Http = new XMLHttpRequest();
  const url = 'https://healthservice.priaid.ch/symptoms?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InN1a3JpdGkxMC50aXdhcmlAZ21haWwuY29tIiwicm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIyNDExIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy92ZXJzaW9uIjoiMTA4IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9saW1pdCI6IjEwMCIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcCI6IkJhc2ljIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9sYW5ndWFnZSI6ImVuLWdiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjA5OS0xMi0zMSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcHN0YXJ0IjoiMjAxOS0wNS0xMSIsImlzcyI6Imh0dHBzOi8vYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU1NzcwMDU2NiwibmJmIjoxNTU3NjkzMzY2fQ.RVJ4GwkYfMBIxL5oQGk-xacNKJxNyp4asbEAlgncuyE&format=json&language=en-gb';
  Http.open("GET", url);
  Http.send();
  userExists = 0;
  Http.onreadystatechange=(e)=>{
    str = Http.responseText.replace(new RegExp('Name', 'g'), 'text');
    str = str.replace(new RegExp('ID','g'), 'id');
    my_data = JSON.parse(str);
    var test = $('#test');
    $(test).select2({
        data:my_data.slice(1,10),
        multiple: true,
        width: "300px"
    });

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
  apiKey: 'z2Tg3V2lpP2i8chmYCcKY564upvcYpep3Z9eSI0b'
});

function submitSymptom() {
  const Http = new XMLHttpRequest();
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InN1a3JpdGkxMC50aXdhcmlAZ21haWwuY29tIiwicm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIyNDExIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy92ZXJzaW9uIjoiMTA4IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9saW1pdCI6IjEwMCIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcCI6IkJhc2ljIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9sYW5ndWFnZSI6ImVuLWdiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjA5OS0xMi0zMSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcHN0YXJ0IjoiMjAxOS0wNS0xMSIsImlzcyI6Imh0dHBzOi8vYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU1NzcwMjIyOSwibmJmIjoxNTU3Njk1MDI5fQ.P6jEDLX-5RTbcToWFwu4Q_8c7Ez4I9Qqq6zrZfVJJ1w&format=json&language=en-gb';
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
  const url = 'https://healthservice.priaid.ch/diagnosis?symptoms=[' + symptoms + ']&gender=' + gender + '&year_of_birth=' + age +'&token='+ token;
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
                  // Add success callback code here.
                  $("#userMsg").val("");
                  var a = $("<div class='incoming_msg'><div class='incoming_msg_img'><img src='img/icon.jpg'></div><div class='received_msg'><p>" + data["data"]["response"] + "</p></div></div></div>");
                  $("#m_his").append(a);    

                  console.log(data["data"]["response"]);

                 // $('#botResponse').val(data["data"]["response"]);
                }).catch( function(result){
                  // Add error callback code here.
                  console.log(result);
                });
    });
}); 