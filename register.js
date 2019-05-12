var questions = [
  {question:"What's your first name?"},
  {question:"What's your last name?"},
  {question:"What's your height in centimeters?"},
  {question:"What's your weight in pounds?"},
  {question:"What's your age?"},
  {question:"Are you allergic to any medication? If yes list them, else say no!"},
  {question:"Do you have past medical history of any of these diseases?"},
  {question:"Does anyone in your family have past medical history of any of these diseases?"},
  {question:"List your emergency contact number!"}
];(function(){

  var tTime = 100  // transition transform time from #register in ms
  var wTime = 200  // transition width time from #register in ms
  var eTime = 1000 // transition width time from inputLabel in ms

  // init
  // --------------
  var position = 0

  putQuestion()

  progressButton.addEventListener('click', validate)
  inputField.addEventListener('keyup', function(e){
    transform(0, 0) // ie hack to redraw
    if(e.keyCode == 13) {
      validate();
    }
  })

  submitOK.addEventListener('click', function(e) {
    //transform(0, 0)
    validate();
  })

  var answers = ["", "", "", "", "", "", ""];
  var answers_map = {firstName : "", 
                lastName : "", 
                height : "",
                weight : "",
                age : "",
                medicationalAllergies : "",
                diseaseHistory : [], 
                familyDiseaseHistory : [],
                emergencyContact : ""
              };

  // functions
  // --------------

  // load the next question
  function putQuestion() {
    inputLabel = document.getElementById('inputLabel');
    inputField = document.getElementById('inputField');
    inputField.className = "question";
    inputLabel.innerHTML = questions[position].question;
    
    inputField.value = ''
    inputField.type = questions[position].type || 'text'  
    if (position === 6) {
      document.getElementById('inputField').setAttribute("style", "display: none");
      document.getElementById('inputProgress').setAttribute("style", "display: none");
      document.getElementById('diseases').setAttribute("style", "display: block");
      document.getElementById('submitOK').setAttribute("style", "display: block");
    } else {
      document.getElementById('inputField').setAttribute("style", "display: block");
      document.getElementById('inputProgress').setAttribute("style", "display: block");
      document.getElementById('diseases').setAttribute("style", "display: none");
      document.getElementById('submitOK').setAttribute("style", "display: none");
    }
    inputField.focus()
    showCurrent()
  }
  
  // when all the questions have been answered
  function done() {
    answers_map['id'] = window.sessionStorage.getItem("username")
    answers_map["firstName"] = answers[0];
    answers_map["lastName"] = answers[1];
    answers_map["height"] = answers[2];
    answers_map["weight"] = answers[3];
    answers_map["age"] = answers[4];
    answers_map["medicationalAllergies"] = answers[5];
    answers_map["diseaseHistory"] = answers[6];
    answers_map["familyDiseaseHistory"] = answers[7];
    answers_map["emergencyContact"] = answers[8];
    answers_map["isDoctor"] = "false"
    console.log(answers_map);
    // remove the box if there is no next question
    register.className = 'close'
    
    // add the h1 at the end with the welcome text
    var h1 = document.createElement('h1')
    h1.appendChild(document.createTextNode('Welcome ' + questions[0].value + '!'))
    setTimeout(function() {
      register.parentElement.appendChild(h1)     
      setTimeout(function() {h1.style.opacity = 1}, 50)
    }, eTime)

    const Http = new XMLHttpRequest();
    const url='https://qc1nm97cu7.execute-api.us-east-1.amazonaws.com/beta/user';
    Http.open("POST", url);
    Http.send(body=JSON.stringify(answers_map));
    userExists = 0;
    Http.onreadystatechange=(e)=>{
      window.location.replace("index.html#id_token=" + window.sessionStorage.getItem("token"));
    }
  }

  // when submitting the current question
  function validate() {
    if (position === 6) {
      diseases = [];
      if (document.getElementById('Diabetes').checked) diseases.push('Diabetes');
      if (document.getElementById('HeartConditions').checked) diseases.push('Heart Conditions');
      if (document.getElementById('Cancer').checked) diseases.push('Cancer');
      if (document.getElementById('PsychologicalDisorders').checked) diseases.push('Psychological disorders');
      if (document.getElementById('BloodPressureProblems').checked) diseases.push('Blood pressure problems');
      if (document.getElementById('None').checked) diseases.push('None');
      answers[position] = diseases;
      position += 1;
    } else {
      // set the value of the field into the array
      questions[position].value = inputField.value;

      // check if the pattern matches
      if (!inputField.value.match(questions[position].pattern || /.+/)) wrong();
      else ok(function() {
        progress.style.width = ++position * 100 / questions.length + 'vw';
        answers[position-1] = inputField.value;
      })
    }
    // if there is a new question, hide current and load next
    if (questions[position+1]) hideCurrent(putQuestion)
    else hideCurrent(done)
  }

  // helper
  // --------------

  function hideCurrent(callback) {
    inputContainer.style.opacity = 0
    inputProgress.style.transition = 'none'
    inputProgress.style.width = 0
    setTimeout(callback, wTime)
  }

  function showCurrent(callback) {
    inputContainer.style.opacity = 1
    inputProgress.style.transition = ''
    inputProgress.style.width = '100%'
    setTimeout(callback, wTime)
  }

  function transform(x, y) {
    register.style.transform = 'translate(' + x + 'px ,  ' + y + 'px)'
  }

  function ok(callback) {
    register.className = ''
    setTimeout(transform, tTime * 0, 0, 10)
    setTimeout(transform, tTime * 1, 0, 0)
    setTimeout(callback,  tTime * 2)
  }

  function wrong(callback) {
    register.className = 'wrong'
    for(var i = 0; i < 6; i++) // shaking motion
      setTimeout(transform, tTime * i, (i%2*2-1)*20, 0)
      setTimeout(transform, tTime * 6, 0, 0)
      setTimeout(callback,  tTime * 7)
  }
}())