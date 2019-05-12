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

const Http = new XMLHttpRequest();
const url='https://qc1nm97cu7.execute-api.us-east-1.amazonaws.com/beta/user?userid='+token['email'];
Http.open("GET", url);
Http.send();
userExists = 0;
Http.onreadystatechange=(e)=>{
    userExists = Http.responseText;
    console.log(userExists);
    if(userExists=='0') {
        window.location.replace("register.html#id_token=" + og_token);
    };
}
