import { loadData, getRandomTextByDifficulty } from "./dataRepository.js";
import { TypingSession } from "./typingSession.js";

const $ = document.querySelector.bind(document);
const wpmValueEl = $("#wpm-value");
const accuracyValueEl = $("#accuracy-value");
const timeValueEl = $("#time-value");
const modeEl = $("#mode");
const difficultyEl = $("#difficulty");
const textToTypeEl = $("#text-to-type");

const data = await loadData();

const typingSession = new TypingSession();
typingSession.setElements(
    wpmValueEl,
    accuracyValueEl,
    timeValueEl,
    textToTypeEl);

modeEl.addEventListener("input", setTime);
difficultyEl.addEventListener("input", setDifficulty);

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
    typingSession.setCurrentTimeSeconds(time === "passage" ? time : parseInt(time));
    typingSession.updateTimeEl();
}