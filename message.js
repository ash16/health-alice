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
        var cell1 = row.insertCell(0);

        var elem = inputJson[i];
        var name = elem['firstName'] + ' ' + elem['lastName'];
        
        var specialization = '<span class="details">';
        for (var j = 0; j < elem['specialization'].length; j++) {
            specialization = specialization + elem['specialization'][j] + ", ";
        }
        if (specialization.length > 2) specialization = specialization.substr(0, specialization.length - 2);
        specialization = specialization + '</span>';
        var curr_doctor = name + '<br>' + specialization;
        cell1.innerHTML = curr_doctor;
    }
}