import { $ } from "./querySelector.js";
import { COLOR_YELLOW, COLOR_RED } from "./colors.js";
import { getAccuracyColor } from "./accuracyUtils.js";
import {
    displayTestCompletePage,
    TEST_COMPLETE_DEFAULT,
    TEST_COMPLETE_FIRST_TEST,
    TEST_COMPLETE_NEW_PERSONAL_BEST
} from "./pages.js";
import { bestScoreRepository } from "./bestScoreRepository.js";

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
        this._textToTypeWithInputEl = $("#text-to-type-with-input");
        this._textToTypeInputEl = $("#text-to-type-input");
        this._intervalId = null;
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
        this._currentTimeMs = value;
        this._startTimeMs = this._currentTimeMs;
    }

    setText(value) {
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
        const accuracy = this.getAccuracy();
        this._accuracyEl.textContent = accuracy + "%";

        this._accuracyEl.style.color = this._typedCount !== 0 ? getAccuracyColor(accuracy) : "";
    }

    updateTimeEl() {
        if (this._currentTimeMs === "passage") {
            this._timeEl.textContent = "-";
            return;
        }

        const currentTimeSeconds = Math.ceil(this._currentTimeMs / 1000);
        let seconds = currentTimeSeconds % 60;
        seconds = seconds > 9 ? seconds : `0${seconds}`;

        let minutes = Math.floor(currentTimeSeconds / 60);
        minutes = minutes > 9 ? minutes : `0${minutes}`;

        this._timeEl.textContent = `${minutes}:${seconds}`;

        if (this._currentTimeMs === this._startTimeMs) {
            this._timeEl.style.color = "";
        }
        else {
            this._timeEl.style.color = (this._currentTimeMs >= this._startTimeMs * 0.25) ? COLOR_YELLOW : COLOR_RED;
        }
    }

    _initTextToTypeElContent() {
        const letters = this._text.split("").map(l => `<span>${l}</span>`);
        this._textToTypeEl.innerHTML = letters.join("");

        this._lettersOffsetTopMin = this._textToTypeEl.children[0].offsetTop;
    }


    start() {
        this._textToTypeEl.scrollTop = 0;
        this._currentTimeMs = this._startTimeMs;
        this._textToTypeInputEl.value = "";
        this._textToTypeInputEl.focus();

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
        this.stop();

        this._currentTimeMs = this._startTimeMs;
        this.setText(text);

        this.updateElements();
    }

    stop() {
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
            this._displayTestCompletePage();
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
            this._displayTestCompletePage();
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
        this._textToTypeEl.scrollTop = Math.max(newScrollTop, 0);
    }

    _addKeyEvent() {
        let previousInputValue = this._textToTypeInputEl.value;
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

        this._textToTypeInputEl.addEventListener("input", this._typeKeyHandlerWrapper);
    }

    _removeKeyEvent() {
        if (this._typeKeyHandlerWrapper == null) {
            return;
        }

        this._textToTypeInputEl.removeEventListener("input", this._typeKeyHandlerWrapper);
        this._textToTypeInputEl.value = "";
    }

    _displayTestCompletePage() {
        if (this._typedCount < this._text.length){
            this._typedCount = this._text.length;
        }

        const wpm = this.getWpm();
        const pageType = this._processWpm(wpm);

        displayTestCompletePage({
            wpm: wpm,
            accuracy: this.getAccuracy(),
            correctCount: this._typedCorrectlyCount,
            wrongCount: this.getErrorCount(),
            pageType: pageType
        });
    }

    _processWpm(wpm){
        const bestScore = bestScoreRepository.getBestScore();
        let pageType = TEST_COMPLETE_FIRST_TEST;
        if (bestScore != null){
            if (wpm > bestScore){
                bestScoreRepository.setBestScore(wpm);
                pageType = TEST_COMPLETE_NEW_PERSONAL_BEST;
            }
            else{
                pageType = TEST_COMPLETE_DEFAULT;
            }
        }
        else{
            bestScoreRepository.setBestScore(wpm);
        }

        return pageType
    }
}