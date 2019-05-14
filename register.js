var specialization = [
  "General practice",
  "Orthopedics",
  "Gastroenterology",
  "Internal medicine",
  "Nephrology",
  "Urology",
  "Surgery",
  "Rheumatology",
  "Dermatology",
  "Pulmonology",
  "Ophthalmology",
  "Allergology",
  "Psychiatry",
  "Geriatric medicine",
  "Cardiology",
  "Endocrinology"
]

var test = $('#test');
      $(test).select2({
          data:specialization,
          multiple: true,
          width: 500
      });

var doctor_selections = null;
$(test).change(function() {
  doctor_selections = ( JSON.stringify($(test).select2('data')) );
    console.log('Selected options: ' + doctor_selections);
    $('#selectedText').text(doctor_selections);
    console.log(doctor_selections);
});

var question = ["Are you a doctor?"]

var common_questions = [
  {question:"What's your first name?"},
  {question:"What's your last name?"},
]

var doctor_questions = common_questions.concat([
  {question:"What's your specialization?"}
]);

var isDoctor = false;

var patient_questions = common_questions.concat([
  {question:"What's your height in centimeters?"},
  {question:"What's your weight in pounds?"},
  {question:"What's your age?"},
  {question:"What's your gender?"},
  {question:"Are you allergic to any medication? If yes list them, else say no!"},
  {question:"Do you have past medical history of any of these diseases?"},
  {question:"Does anyone in your family have past medical history of any of these diseases?"},
  {question:"List your emergency contact number!"}
]);(function(){

  var tTime = 100  // transition transform time from #register in ms
  var wTime = 200  // transition width time from #register in ms
  var eTime = 1000 // transition width time from inputLabel in ms

  // init
  // --------------
  var position = 0

  checkIfDoctor()
  function checkIfDoctor() {
    inputLabel = document.getElementById('inputLabel');
    inputField = document.getElementById('inputField');
    inputField.className = "question";
    inputLabel.innerHTML = question[0];
    
    document.getElementById('inputField').setAttribute("style", "display: none");
    document.getElementById('inputProgress').setAttribute("style", "display: none");
    document.getElementById('doctor_patient').setAttribute("style", "display: block");
    document.getElementById('doctor_patient_submit').setAttribute("style", "display: block");

    inputField.focus()
    showCurrent()
  }

  specialty_submit.addEventListener('click', function(e) {
    
    if(doctor_selections){
      document.getElementById('specialty').setAttribute("style", "display: none");
      document.getElementById('specialty_submit').setAttribute("style", "display: none");
      validate();
    }
  })

  doctor_patient_submit.addEventListener('click', function(e) {
    //transform(0, 0)
    isDoctor = document.getElementById('Doctor_Yes').checked;
    console.log(isDoctor);

    if (isDoctor){
      questions = doctor_questions;
    }
    else{
      questions = patient_questions;
    }
    
    document.getElementById('doctor_patient').setAttribute("style", "display: none");
    document.getElementById('doctor_patient_submit').setAttribute("style", "display: none");

    putQuestion()
  })


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

  gender_submit.addEventListener('click', function(e) {
    validate();
  })

  var answers = ["", "", "", "", "", "", "", "", "", ""];
  var answers_map = { };

  // functions
  // --------------

  // load the next question
  function putQuestion() {
    console.log(questions);
    inputLabel = document.getElementById('inputLabel');
    inputField = document.getElementById('inputField');
    inputField.className = "question";
    inputLabel.innerHTML = questions[position].question;
    
    inputField.value = ''
    inputField.type = questions[position].type || 'text'
    if (position === 5 && !isDoctor) {
      document.getElementById('inputField').setAttribute("style", "display: none");
      document.getElementById('inputProgress').setAttribute("style", "display: none");
      document.getElementById('diseases').setAttribute("style", "display: none");
      document.getElementById('submitOK').setAttribute("style", "display: none");
      document.getElementById('gender').setAttribute("style", "display: block");
      document.getElementById('gender_submit').setAttribute("style", "display: block");
    }
    if (position === 2 && isDoctor) {
      document.getElementById('inputField').setAttribute("style", "display: none");
      document.getElementById('inputProgress').setAttribute("style", "display: none");
      document.getElementById('specialty').setAttribute("style", "display: block");
      document.getElementById('specialty_submit').setAttribute("style", "display: block");

    }
    else if (position == 7 && !isDoctor) {
      document.getElementById('inputField').setAttribute("style", "display: none");
      document.getElementById('inputProgress').setAttribute("style", "display: none");
      document.getElementById('diseases').setAttribute("style", "display: block");
      document.getElementById('submitOK').setAttribute("style", "display: block");
      document.getElementById('gender').setAttribute("style", "display: none");
      document.getElementById('gender_submit').setAttribute("style", "display: none");
    } else {
      document.getElementById('inputField').setAttribute("style", "display: block");
      document.getElementById('inputProgress').setAttribute("style", "display: block");
      document.getElementById('diseases').setAttribute("style", "display: none");
      document.getElementById('submitOK').setAttribute("style", "display: none");
      document.getElementById('gender').setAttribute("style", "display: none");
      document.getElementById('gender_submit').setAttribute("style", "display: none");
    }
    inputField.focus()
    showCurrent()
  }
  
  // when all the questions have been answered
  function done() {
    answers_map['id'] = window.sessionStorage.getItem("username");
    answers_map["isDoctor"] = isDoctor;
    answers_map["firstName"] = answers[0];
    answers_map["lastName"] = answers[1];

    if (isDoctor){
      answers_map["specialization"] = answers[2];
    }
    else{
      answers_map["height"] = answers[2];
      answers_map["weight"] = answers[3];
      answers_map["age"] = answers[4];
      answers_map["gender"] = answers[5].toLowerCase();
      answers_map["medicationalAllergies"] = answers[6];
      answers_map["diseaseHistory"] = answers[7];
      answers_map["familyDiseaseHistory"] = answers[8];
      answers_map["emergencyContact"] = answers[9];
    }
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
      console.log(Http);
      window.location.replace("index.html#id_token=" + window.sessionStorage.getItem("token"));
    }
  }

  // when submitting the current question
  function validate() {
    if (position === 7) {
      diseases = [];
      if (document.getElementById('Diabetes').checked) diseases.push('Diabetes');
      if (document.getElementById('HeartConditions').checked) diseases.push('Heart Conditions');
      if (document.getElementById('Cancer').checked) diseases.push('Cancer');
      if (document.getElementById('PsychologicalDisorders').checked) diseases.push('Psychological disorders');
      if (document.getElementById('BloodPressureProblems').checked) diseases.push('Blood pressure problems');
      if (document.getElementById('None').checked) diseases.push('None');
      answers[position] = diseases;
      position += 1;
    } 
    else if (position == 2 && isDoctor){
      var temp = [];
      data = JSON.parse(doctor_selections);
      for (var row in data){
        temp.push(data[row]['text']);
      }
      answers[position] = temp;
    }
    else if (position === 5){
      if (document.getElementById('Gender_Male').checked) answers[position] = 'male';
      else answers[position] = 'female';
      position += 1
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
    console.log(answers);
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