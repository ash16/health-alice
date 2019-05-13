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