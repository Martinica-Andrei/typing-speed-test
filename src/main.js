import { loadData, getRandomTextByDifficulty } from "./dataRepository.js";
import { TypingSession } from "./typingSession.js";

const $ = document.querySelector.bind(document);
const wpmValueEl = $("#wpm-value");
const accuracyValueEl = $("#accuracy-value");
const timeValueEl = $("#time-value");
const modeEl = $("#mode");
const difficultyEl = $("#difficulty");
const textToTypeEl = $("#text-to-type");
const startBtnEl = $("#start-btn");

const data = await loadData();

const typingSession = new TypingSession();
typingSession.setElements(
    wpmValueEl,
    accuracyValueEl,
    timeValueEl,
    textToTypeEl);

modeEl.addEventListener("input", setTime);
difficultyEl.addEventListener("input", setDifficulty);
startBtnEl.addEventListener("click", () => typingSession.start());

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