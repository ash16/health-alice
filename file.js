
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

function check() {
  console.log(getParameterByName('id_token'));
  if(getParameterByName('id_token')==null) {
      window.location = "https://healthalice.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=4ivbh3k366f87ql2dpbj3dahpr&redirect_uri=https://alicehealth.s3.amazonaws.com/index.html";
  } 
}