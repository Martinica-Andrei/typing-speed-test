import { $ } from "./querySelector.js";

export const TEST_COMPLETE_DEFAULT = 0;
export const TEST_COMPLETE_FIRST_TEST = 1;
export const TEST_COMPLETE_NEW_PERSONAL_BEST = 2;

const statisticsEl = $("#statistics");
const optionsEl = $("#options");
const contentEl = $("#content");
const contentBottomEl = $("#content-bottom");
const testCompleteSectionEl = $("#test-complete-section");

const testCompleteWpmValueEl = $("#test-complete-wpm-value");
const testCompleteAccuracyValueEl = $("#test-complete-accuracy-value");
const testCompleteCharactersCorrectEl = $("#test-complete-characters-correct");
const testCompleteCharactersWrongEl = $("#test-complete-characters-wrong");

const testCompleteTitleEl = $("#test-complete-title");
const testCompleteDescriptionEl = $("#test-complete-description");

const iconCompletedEl = $("#icon-completed");
const iconNewPersonalBestEl = $("#icon-new-personal-best");
const starTopEl = $("#star-top");

export function displayMainPage() {
    statisticsEl.style.display = "";
    optionsEl.style.display = "";
    contentBottomEl.style.display = "";
    testCompleteSectionEl.style.display = "none";
    contentEl.classList.add("content");
}

export function displayTestCompletePage({ wpm, accuracy, correctCount, wrongCount, pageType }) {
    statisticsEl.style.display = "none";
    optionsEl.style.display = "none";
    contentBottomEl.style.display = "none";
    testCompleteSectionEl.style.display = "";
    contentEl.classList.remove("content");

    testCompleteWpmValueEl.textContent = wpm;
    testCompleteAccuracyValueEl.textContent = accuracy + "%";
    testCompleteCharactersCorrectEl.textContent = correctCount;
    testCompleteCharactersWrongEl.textContent = wrongCount;

    switch (pageType) {
        case TEST_COMPLETE_FIRST_TEST:
            showCompletedIcon();
            testCompleteTitleEl.textContent = "Baseline Established!";
            testCompleteDescriptionEl.textContent = "You've set the bar. Now the real challenge begins - time to beat it.";
            break;
        case TEST_COMPLETE_NEW_PERSONAL_BEST:
            showPersonalBestIcon();
            testCompleteTitleEl.textContent = "High Score Smashed!";
            testCompleteDescriptionEl.textContent = "You're getting faster. That was incredible typing.";
            break;
        default:
            showCompletedIcon();
            testCompleteTitleEl.textContent = "Test Complete!";
            testCompleteDescriptionEl.textContent = "Solid run. Keep pushing to beat your high score.";
            break;
    }
}

function showCompletedIcon() {
    iconCompletedEl.style.display = "";
    iconNewPersonalBestEl.style.display = "none";
    starTopEl.style.display = "";
}

function showPersonalBestIcon() {
    iconCompletedEl.style.display = "none";
    iconNewPersonalBestEl.style.display = "";
    starTopEl.style.display = "none";
}