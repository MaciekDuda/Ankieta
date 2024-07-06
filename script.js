let userName;

window.onload = function() {
    setTimeout(function() {
        userName = prompt("Jak masz na imię?");
        loadResults();
        updateSummary();
    }, 500);
};

function updateOptions(changedId, otherId1, otherId2) {
    const selectedValue = document.getElementById(changedId).value;
    
    const options = ["Mazury", "Podlasie", "Tatry"];
    
    const updateSelect = (selectId, excludedValues) => {
        const selectElement = document.getElementById(selectId);
        const currentValue = selectElement.value;
        
        selectElement.innerHTML = "";
        
        options.forEach(option => {
            if (!excludedValues.includes(option)) {
                const optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                if (option === currentValue) {
                    optionElement.selected = true;
                }
                selectElement.appendChild(optionElement);
            }
        });
    };

    // Zaktualizuj pierwszą listę rozwijaną, wyłączając wybraną wartość
    updateSelect(otherId1, [selectedValue]);
    // Zaktualizuj drugą listę rozwijaną, wyłączając wybraną wartość oraz wartość z pierwszej listy
    updateSelect(otherId2, [selectedValue, document.getElementById(otherId1).value]);
}

function submitVotes() {
    const firstChoice = document.getElementById('firstChoice').value;
    const secondChoice = document.getElementById('secondChoice').value;
    const thirdChoice = document.getElementById('thirdChoice').value;

    const resultsTable = document.getElementById('resultsTable');

    const newRow1 = resultsTable.insertRow();
    newRow1.insertCell(0).textContent = userName;
    newRow1.insertCell(1).textContent = firstChoice;
    newRow1.insertCell(2).textContent = 3;

    const newRow2 = resultsTable.insertRow();
    newRow2.insertCell(0).textContent = userName;
    newRow2.insertCell(1).textContent = secondChoice;
    newRow2.insertCell(2).textContent = 2;

    const newRow3 = resultsTable.insertRow();
    newRow3.insertCell(0).textContent = userName;
    newRow3.insertCell(1).textContent = thirdChoice;
    newRow3.insertCell(2).textContent = 1;

    saveResults(userName, firstChoice, 3);
    saveResults(userName, secondChoice, 2);
    saveResults(userName, thirdChoice, 1);

    updateSummary();
}

function saveResults(name, choice, points) {
    let results = JSON.parse(localStorage.getItem('results')) || [];
    results.push({name: name, choice: choice, points: points});
    localStorage.setItem('results', JSON.stringify(results));
}

function loadResults() {
    const resultsTable = document.getElementById('resultsTable');
    let results = JSON.parse(localStorage.getItem('results')) || [];
    
    results.forEach(result => {
        const newRow = resultsTable.insertRow();
        newRow.insertCell(0).textContent = result.name;
        newRow.insertCell(1).textContent = result.choice;
        newRow.insertCell(2).textContent = result.points;
    });
}

function updateSummary() {
    const summaryTable = document.getElementById('summaryTable');
    summaryTable.innerHTML = `
        <tr>
            <th>Opcja</th>
            <th>Punkty</th>
        </tr>
    `;

    let results = JSON.parse(localStorage.getItem('results')) || [];
    let summary = {
        'Mazury': 0,
        'Podlasie': 0,
        'Tatry': 0
    };

    results.forEach(result => {
        summary[result.choice] += result.points;
    });

    let sortable = [];
    for (let option in summary) {
        sortable.push([option, summary[option]]);
    }

    sortable.sort((a, b) => b[1] - a[1]);

    sortable.forEach(item => {
        const newRow = summaryTable.insertRow();
        newRow.insertCell(0).textContent = item[0];
        newRow.insertCell(1).textContent = item[1];
    });
}

function clearVotes() {
    localStorage.removeItem('results');
    location.reload(); // Odświeża stronę, aby usunięte zostały wyniki
}
