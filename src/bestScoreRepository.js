import { $ } from "./querySelector.js";

const personalBestEl = $("#personal-best-value");
const bestScoreKey = "best-score";

export const bestScoreRepository = {
    getBestScore() {
        const bestScore = localStorage.getItem(bestScoreKey);
        return bestScore != null ? parseInt(bestScore) : null;
    },
    setBestScore(value) {
        localStorage.setItem(bestScoreKey, value.toString());
        this.updatePersonalBestEl();
    },
    updatePersonalBestEl() {
        const bestScore = this.getBestScore();
        if (bestScore != null) {
            personalBestEl.textContent = bestScore + " WPM";
        }
        else{
            personalBestEl.textContent = "-";
        }
    }
}