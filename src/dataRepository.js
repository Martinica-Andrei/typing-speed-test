export async function loadData() {
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

export function getRandomTextByDifficulty(data, difficulty){
    const texts = data[difficulty];
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex].text;
}