import { loadData } from "./dataRepository.js";
import { TypingSession } from "./typingSession.js";

const $ = document.querySelector.bind(document);
const wpmValueEl = $("#wpm-value");
const accuracyValueEl = $("#accuracy-value");
const timeValueEl = $("#time-value");

const textToTypeEl = $("#text-to-type");

const data = await loadData();

const typingSession = new TypingSession();
typingSession.setElements(
    wpmValueEl,
    accuracyValueEl,
    timeValueEl);

textToTypeEl.textContent = data.easy[0].text;

typingSession.updateElements();