const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const searchForm = document.getElementById("search_input");
const testInput = document.getElementById("input_text");
const resultsContainer = document.getElementById("results");

// fetch data
async function fetchData(event) {
    event.preventDefault();
    const word = testInput.value.trim();

    resultsContainer.innerHTML = "loading...";

    try {
        const response = await fetch(`${BASE_URL}${word}`);
        
        if (!response.ok) {
        throw new error("We couldn't find that word. Try another!");
            return;
        }

        const data = await response.json();
     
        displayWordData(data[0]);

    } catch (error) {
        console.error("Fetch Error:", error);
        showError("Error fetching data");
    }
}

function displayWordData(entry) {
    resultsContainer.innerHTML = ""; 
    const header = document.createElement("div");
    header.innerHTML = `
        <h2>${entry.word}</h2>
        <p class="phonetic">${entry.phonetic || ""}</p>
    `;

    const audioSource = entry.phonetics.find(p => p.audio !== "")?.audio;
    if (audioSource) {
        const audioBtn = document.createElement("button");
        audioBtn.innerText = "Play Sound";
        audioBtn.onclick = () => new Audio(audioSource).play();
        header.appendChild(audioBtn);
    }

    const meaningsList = document.createElement("div");
    meaningsList.className = "meanings-container";

    entry.meanings.forEach(meaning => {
        const section = document.createElement("section");
        section.className = "part-of-speech";
    
        const definitionsHTML = meaning.definitions
            .map(def => `<li>${def.definition}</li>`)
            .join("");

        section.innerHTML = `
            <h3>${meaning.partOfSpeech}</h3>
            <ul>${definitionsHTML}</ul>
        `;
        meaningsList.appendChild(section);
    });

    resultsContainer.appendChild(header);
    resultsContainer.appendChild(meaningsList);
}

function showError(message) {
    resultsContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}

searchForm.addEventListener('submit', fetchData);