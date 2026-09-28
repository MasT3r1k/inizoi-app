const search_input = document.querySelector("#query");
const results_content = document.querySelector("#results-content");
const search_btn = document.querySelector("#search-btn");
const download_btn = document.querySelector("#download");

let search_word = "";
let search_results = [];

async function search() {
    const query = search_input.value.trim();
    if (query === "" || search_word === query) return;

    search_btn.disabled = true;
    search_btn.innerHTML = '<span>Hledám...</span>';
    results_content.innerHTML = `
        <div class="loader">
            <div class="spinner"></div>
            <span>Vyhledávám výsledky pro "${query}"...</span>
        </div>
    `;
    download_btn.style.display = "none";

    try {
        const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Chyba při komunikaci se serverem.");
        
        const json = await response.json();
        
        if (!json.results || !json.search_string) {
            showEmptyState("Nepodařilo se najít žádné výsledky.");
            return;
        }

        search_word = json.search_string;
        search_results = json.results;

        if (search_results.length === 0) {
            showEmptyState("Nenalezeny žádné výsledky.");
        } else {
            updateResults(search_results);
            updateDownloadButton(search_results);
        }
    } catch (error) {
        console.error(error);
        showEmptyState("Nastala chyba při vyhledávání. Zkuste to prosím znovu.");
    } finally {
        search_btn.disabled = false;
        search_btn.innerHTML = '<span>Vyhledat</span>';
    }
}

function showEmptyState(message) {
    results_content.innerHTML = `
        <div class="empty-state">
            ${message}
        </div>
    `;
}

function updateDownloadButton(results) {
    const fileName = `search_${search_word}.json`;
    const fileContent = JSON.stringify(results, null, 2);
    const myFile = new Blob([fileContent], { type: 'application/json' });

    window.URL = window.URL || window.webkitURL;
    
    download_btn.setAttribute("href", window.URL.createObjectURL(myFile));
    download_btn.setAttribute("download", fileName);
    download_btn.style.display = "inline-flex";
}

function updateResults(results) {
    results_content.innerHTML = '';
    let html = '';
    results.forEach((result) => {
        html += `
        <a href="${result.link}" target="_blank">
            <div class="card">
                <div class="card-title">${result.title}</div>
                <div class="card-description">${result.snippet}</div>
            </div>
        </a>
        `;
    });

    results_content.innerHTML = html;
}