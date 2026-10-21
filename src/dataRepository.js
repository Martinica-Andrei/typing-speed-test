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