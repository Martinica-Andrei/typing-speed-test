import {
    TYPING_SESSION_STATE_MENU,
    TYPING_SESSION_STATE_RUNNING,
    TYPING_SESSION_STATE_FINISHED
} from "./typingSessionState.js";
import { $ } from "./querySelector.js";
export class TypingSession {
    constructor() {
        this._currentTimeMs = 0;
        this._startTimeMs = 0;
        this._passedTimeMs = 0;
        this._text = "";
        this._wpmEl = $("#wpm-value");
        this._accuracyEl = $("#accuracy-value");
        this._timeEl = $("#time-value");
        this._textToTypeEl = $("#text-to-type");
        this._textToTypeWithInput = $("#text-to-type-with-input");
        this._textToTypeInput = $("#text-to-type-input");
        this._intervalId = null;
        this._state = TYPING_SESSION_STATE_MENU;
        this._currentTextIndex = 0;
        this._typeKeyHandlerWrapper = null;
        this._typedCorrectlyCount = 0;
        this._typedCount = 0;
    }

    getAccuracy() {
        if (this._typedCount === 0) {
            return 100;
        }

        return Math.floor((this._typedCorrectlyCount / this._typedCount) * 100);
    }

    getErrorCount() {
        return this._typedCount - this._typedCorrectlyCount;
    }

    getWpm() {
        const minutes = this._passedTimeMs / 1000 / 60;
        if (minutes === 0) {
            return 0;
        }
        return Math.floor(this._typedCorrectlyCount / 5 / minutes);
    }

    setStartTimeMs(value) {
        if (this._state !== TYPING_SESSION_STATE_MENU) {
            return;
        }
        this._currentTimeMs = value;
        this._startTimeMs = this._currentTimeMs;
    }

    setText(value) {
        if (this._state !== TYPING_SESSION_STATE_MENU) {
            return;
        }
        this._text = value;
        this._currentTextIndex = 0;
        this._typedCorrectlyCount = 0;
        this._typedCount = 0;
        this._passedTimeMs = 0;
        this._initTextToTypeElContent();
    }

    updateElements() {
        this.updateWpmEl();
        this.updateAccuracyEl();
        this.updateTimeEl();
    }

    updateWpmEl() {
        this._wpmEl.textContent = this.getWpm();
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

        this._lettersOffsetTopMin = this._textToTypeEl.children[0].offsetTop;
    }


    start() {
        if (this._state !== TYPING_SESSION_STATE_MENU) {
            return;
        }
        this._state = TYPING_SESSION_STATE_RUNNING;

        this._textToTypeWithInput.scrollTop = 0;
        this._currentTimeMs = this._startTimeMs;
        this._textToTypeInput.value = "";
        this._textToTypeInput.focus();

        this._highlightCurrentLetter();

        this._addKeyEvent();

        const frameRateMs = 13;
        let prevTimeMs = Date.now();
        this._intervalId = setInterval(() => {
            const timeNowMs = Date.now();
            const deltaMs = timeNowMs - prevTimeMs;
            prevTimeMs = timeNowMs;
            if (this._currentTimeMs !== "passage") {
                this._updateCurrentTimeMs(deltaMs);
            }

            this._passedTimeMs += deltaMs;
        }, frameRateMs)
    }

    restart(text) {
        if (this._state !== TYPING_SESSION_STATE_RUNNING) {
            return;
        }

        this.stop();

        this._state = TYPING_SESSION_STATE_MENU;
        this._currentTimeMs = this._startTimeMs;
        this.setText(text);

        this.updateElements();
    }

    stop() {
        if (this._state !== TYPING_SESSION_STATE_RUNNING) {
            return;
        }

        this._state = TYPING_SESSION_STATE_FINISHED;

        this._removeKeyEvent();

        this._clearInterval();
    }

    _clearInterval() {
        if (this._intervalId != null) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }

    _updateCurrentTimeMs(deltaMs) {
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
        const currentLetter = this._textToTypeEl.children[this._currentTextIndex];
        if (key === "Backspace") {
            if (this._currentTextIndex === 0) {
                return;
            }

            this._unhighlightCurrentLetter();
            this._currentTextIndex--;
            this._textToTypeEl.children[this._currentTextIndex].className = "";
            this._highlightCurrentLetter();
            this._processScroll();
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

        if (this._currentTextIndex === this._typedCount) {
            this._typedCount++;
            this._typedCorrectlyCount += isCorrect;
            if (this._currentTextIndex % 15 === 0) {
                this.updateWpmEl();
                this.updateAccuracyEl();
            }
        }

        this._unhighlightCurrentLetter();
        this._currentTextIndex++;
        if (this._currentTextIndex >= this._text.length) {
            this.stop();
            return;
        }
        this._highlightCurrentLetter();

        this._processScroll();
    }

    _processScroll() {
        const minRowsToScroll = 2;
        const currentLetter = this._textToTypeEl.children[this._currentTextIndex];
        const rows = (currentLetter.offsetTop - this._lettersOffsetTopMin) / currentLetter.offsetHeight;
        const newScrollTop = (rows - minRowsToScroll + 1) * currentLetter.offsetHeight;
        this._textToTypeWithInput.scrollTop = Math.max(newScrollTop, 0);
    }

    _addKeyEvent() {
        let previousInputValue = this._textToTypeInput.value;
        this._typeKeyHandlerWrapper = e => {
            const newInputValue = e.target.value;
            if (newInputValue.length > previousInputValue.length) {
                this._typeKeyHandler(newInputValue[newInputValue.length - 1]);
            }
            else if (newInputValue.length < previousInputValue.length) {
                this._typeKeyHandler("Backspace");
            }

            previousInputValue = newInputValue;
        }

        this._textToTypeInput.addEventListener("input", this._typeKeyHandlerWrapper);
    }

    _removeKeyEvent() {
        if (this._typeKeyHandlerWrapper == null) {
            return;
        }

        this._textToTypeInput.removeEventListener("input", this._typeKeyHandlerWrapper);
        this._textToTypeInput.value = "";
    }
}