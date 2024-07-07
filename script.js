import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// Konfiguracja Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBo5Kuapd_UZGEmaAMNEpU8j4nSZt6AWoo",
    authDomain: "voter-ab3e5.firebaseapp.com",
    databaseURL: "https://voter-ab3e5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "voter-ab3e5",
    storageBucket: "voter-ab3e5.appspot.com",
    messagingSenderId: "560473290820",
    appId: "1:560473290820:web:ba6e9cdc3b731175b02411",
    measurementId: "G-PFXHYM8XZM"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

// Logowanie anonimowe
signInAnonymously(auth).catch((error) => {
    console.error('Error during sign-in:', error);
});

let userName;

window.onload = function() {
    userName = prompt("Jak masz na imię?");
    loadResults();
    updateSummary();
};

function updateOptions(changedId, otherId1, otherId2) {
    const selectedValue = document.getElementById(changedId).value;
    
    const options = ["Mazury⛵", "Podlasie🦬", "Tatry⛰️"];
    
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
    const resultsRef = ref(db, 'results');
    push(resultsRef, {
        name: name,
        choice: choice,
        points: points
    });
}

function loadResults() {
    const resultsTable = document.getElementById('resultsTable');
    const resultsRef = ref(db, 'results');
    
    onValue(resultsRef, (snapshot) => {
        resultsTable.innerHTML = ''; // Clear the table before adding rows
        snapshot.forEach((childSnapshot) => {
            const result = childSnapshot.val();
            const newRow = resultsTable.insertRow();
            newRow.insertCell(0).textContent = result.name;
            newRow.insertCell(1).textContent = result.choice;
            newRow.insertCell(2).textContent = result.points;
        });
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

    const resultsRef = ref(db, 'results');
    const summary = {
        'Mazury⛵': 0,
        'Podlasie🦬': 0,
        'Tatry⛰️': 0
    };

    onValue(resultsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const result = childSnapshot.val();
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
    });
}

function clearVotes() {
    const resultsRef = ref(db, 'results');
    set(resultsRef, null);
    location.reload(); // Odświeża stronę, aby usunięte zostały wyniki
}

function clearVotesWithPassword() {
    const password = prompt("Podaj hasło aby wyczyścić głosy:");
    const correctPassword = "kopytko"; // Zastąp "twojeHaslo" rzeczywistym hasłem

    if (password === correctPassword) {
        clearVotes();
    } else {
        alert("Niepoprawne hasło!");
    }
}

// Upewnij się, że funkcje są dostępne globalnie
window.updateOptions = updateOptions;
window.submitVotes = submitVotes;
window.clearVotesWithPassword = clearVotesWithPassword;
