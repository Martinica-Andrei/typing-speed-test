import { loadData, getRandomTextByDifficulty } from "./dataRepository.js";
import { TypingSession } from "./typingSession.js";
import { $ } from "./querySelector.js";
import { displayMainPage, displayTestCompletePage, TEST_COMPLETE_DEFAULT, TEST_COMPLETE_FIRST_TEST, TEST_COMPLETE_NEW_PERSONAL_BEST } from "./pages.js";

const modeEl = $("#mode");
const difficultyEl = $("#difficulty");
const startSectionEl = $("#start-section");
const textToTypeRestartSectionEl = $("#text-to-type-restart-section");


const data = await loadData();
const typingSession = new TypingSession();

modeEl.addEventListener("input", setTime);
difficultyEl.addEventListener("input", setDifficulty);
startSectionEl.addEventListener("click", start);

init();
displayMainPage();

function restart() {
    const text = getRandomTextByDifficulty(data, difficultyEl.value);
    difficultyEl.disabled = false;
    modeEl.disabled = false;
    startSectionEl.style.display = "";
    textToTypeRestartSectionEl.style.display = "";
    typingSession.restart(text);
}

$("#restart-test-btn").addEventListener("click", restart);
$("#go-again-btn").addEventListener("click", () => {
    restart();
    displayMainPage();
});

$("#text-to-type-input").addEventListener("beforeinput", (e) => {
    const input = e.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const length = input.value.length;

    if (start !== length || end !== length) {
        input.setSelectionRange(length, length);
    }
});

function init() {
    setDifficulty();
    setTime();
    typingSession.updateElements();
}

function setDifficulty() {
    const text = getRandomTextByDifficulty(data, difficultyEl.value);
    typingSession.setText(text);
}

function setTime() {
    const time = modeEl.value;
    typingSession.setStartTimeMs(time === "passage" ? time : parseInt(time) * 1000);
    typingSession.updateTimeEl();
}

function start() {
    difficultyEl.disabled = true;
    modeEl.disabled = true;
    startSectionEl.style.display = "none";
    textToTypeRestartSectionEl.style.display = "flex";
    typingSession.start();
}