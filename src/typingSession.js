import {
    TYPING_SESSION_STATE_MENU,
    TYPING_SESSION_STATE_RUNNING,
    TYPING_SESSION_STATE_FINISHED
} from "./typingSessionState.js";
import { $ } from "./querySelector.js";
export class TypingSession {
    constructor() {
        this._wpm = 0;
        this._currentTimeMs = 0;
        this._text = "";
        this._wpmEl = $("#wpm-value");
        this._accuracyEl = $("#accuracy-value");
        this._timeEl = $("#time-value");
        this._textToTypeEl = $("#text-to-type");
        this._intervalId = null;
        this._state = TYPING_SESSION_STATE_MENU;
        this._currentTextIndex = 0;
        this._typeKeyHandlerWrapper = null;
        this._typedCorrectlyCount = 0;
        this._typedCount = 0;
    }

    getAccuracy() {
        return 100;
    }

    setCurrentTimeMs(value) {
        if (this._state !== TYPING_SESSION_STATE_MENU) {
            return;
        }
        this._currentTimeMs = value;
    }

    setText(value) {
        if (this._state !== TYPING_SESSION_STATE_MENU) {
            return;
        }
        this._text = value;
        this._currentTextIndex = 0;
        this._typedCorrectlyCount = 0;
        this._typedCount = 0;
        this._initTextToTypeElContent();
    }

    updateElements() {
        this.updateWpmEl();
        this.updateAccuracyEl();
        this.updateTimeEl();
    }

    updateWpmEl() {
        this._wpmEl.textContent = this._wpm;
    }

    updateAccuracyEl() {
        this._accuracyEl.textContent = this.getAccuracy() + "%";
    }

    updateTimeEl() {
        if (this._currentTimeMs === "passage") {
            this._timeEl.textContent = "-";
        }
        else {
            const currentTimeSeconds = Math.ceil(this._currentTimeMs / 1000);
            let seconds = currentTimeSeconds % 60;
            seconds = seconds > 9 ? seconds : `0${seconds}`;

            let minutes = Math.floor(currentTimeSeconds / 60);
            minutes = minutes > 9 ? minutes : `0${minutes}`;

            this._timeEl.textContent = `${minutes}:${seconds}`;
        }
    }

    _initTextToTypeElContent() {
        const letters = this._text.split("").map(l => `<span>${l}</span>`);
        this._textToTypeEl.innerHTML = letters.join("");
    }


    start() {
        if (this._state !== TYPING_SESSION_STATE_MENU) {
            return;
        }
        this._state = TYPING_SESSION_STATE_RUNNING;

        this._highlightCurrentLetter();

        this._typeKeyHandlerWrapper = e => this._typeKeyHandler(e.key);
        document.addEventListener("keydown", this._typeKeyHandlerWrapper);

        if (this._currentTimeMs !== "passage") {
            const frameRateMs = 13;
            let prevTimeMs = Date.now();
            this._intervalId = setInterval(() => {
                const timeNowMs = Date.now();
                const deltaMs = timeNowMs - prevTimeMs;
                prevTimeMs = timeNowMs;
                this._loop(deltaMs)
            }, frameRateMs)
        }
    }

    stop() {
        if (this._state !== TYPING_SESSION_STATE_RUNNING) {
            return;
        }

        this._state = TYPING_SESSION_STATE_FINISHED;

        if (this._typeKeyHandlerWrapper != null) {
            document.removeEventListener("keydown", this._typeKeyHandlerWrapper);
        }

        if (this._intervalId != null) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }

    _loop(deltaMs) {
        this._currentTimeMs = Math.max(0, this._currentTimeMs - deltaMs);
        this.updateTimeEl();
        if (this._currentTimeMs === 0) {
            this.stop();
        }
    }

    _highlightCurrentLetter() {
        const letterSpan = this._textToTypeEl.children[this._currentTextIndex];
        letterSpan.classList.add("highlight-current-letter");
    }

    _unhighlightCurrentLetter() {
        this._textToTypeEl.children[this._currentTextIndex]
            .classList.remove("highlight-current-letter");
    }

    _typeKeyHandler(key) {
        if (["Alt", "Shift", "Tab", "CapsLock", "Control"].includes(key)) {
            return;
        }

        const currentLetter = this._textToTypeEl.children[this._currentTextIndex];
        if (key === "Backspace") {
            if (this._currentTextIndex === 0) {
                return;
            }

            this._unhighlightCurrentLetter();
            this._currentTextIndex--;
            this._textToTypeEl.children[this._currentTextIndex].className = "";
            this._highlightCurrentLetter();
            return;
        }

        const isCorrect = currentLetter.textContent === key;
        if (isCorrect) {
            currentLetter.classList.add("highlight-correct-letter");
            currentLetter.classList.remove("highlight-wrong-letter");
        }
        else {
            currentLetter.classList.remove("highlight-correct-letter");
            currentLetter.classList.add("highlight-wrong-letter");
        }
        
        if (this._currentTextIndex === this._typedCount){
            this._typedCount++;
            this._typedCorrectlyCount += isCorrect;
        }

        this._unhighlightCurrentLetter();
        this._currentTextIndex++;
        if (this._currentTextIndex >= this._text.length){
            this.stop();
            return;
        }
        this._highlightCurrentLetter();
    }
}