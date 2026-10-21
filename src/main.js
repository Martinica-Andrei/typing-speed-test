const $ = document.querySelector.bind(document);

const textToTypeEl = $("#text-to-type");

const data = await loadData();

textToTypeEl.textContent = data.easy[0].text;

async function loadData() {
    try {
        const response = await fetch("data.json");
        if (response.ok) {
            return await response.json();
        }
    }
    catch {
        // empty
    }

    return null;
}