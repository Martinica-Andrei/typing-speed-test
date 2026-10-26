import { loadData, getRandomTextByDifficulty } from "./dataRepository.js";
import { TypingSession } from "./typingSession.js";
import { $ } from "./querySelector.js";

const modeEl = $("#mode");
const difficultyEl = $("#difficulty");
const startBtnEl = $("#start-btn");
const startSectionEl = $("#start-section");

const data = await loadData();

const typingSession = new TypingSession();

modeEl.addEventListener("input", setTime);
difficultyEl.addEventListener("input", setDifficulty);
startBtnEl.addEventListener("click", start);

init();

function init(){
    setDifficulty();
    setTime();
    typingSession.updateElements();
}

function setDifficulty(){
    const text = getRandomTextByDifficulty(data, difficultyEl.value);
    typingSession.setText(text);
    typingSession.updateTextToTypeEl();
}

function setTime(){
    const time = modeEl.value;
    typingSession.setCurrentTimeMs(time === "passage" ? time : parseInt(time) * 1000);
    typingSession.updateTimeEl();
}

function start(){
    difficultyEl.disabled = true;
    modeEl.disabled = true;
    startSectionEl.style.display = "none";
    typingSession.start();
}