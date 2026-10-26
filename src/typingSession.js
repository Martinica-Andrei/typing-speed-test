export class TypingSession {
    constructor() {
        this._wpm = 0;
        this._currentTimeMs = 0;
        this._text = "";
        this._wpmEl = null;
        this._accuracyEl = null;
        this._timeEl = null;
        this._textToTypeEl = null;
        this._intervalId = null;
    }

    getAccuracy() {
        return 100;
    }

    setElements(
        wpmEl,
        accuracyEl,
        timeEl,
        textToTypeEl) {
        this._wpmEl = wpmEl;
        this._accuracyEl = accuracyEl;
        this._timeEl = timeEl;
        this._textToTypeEl = textToTypeEl;
    }

    setCurrentTimeMs(value) {
        this._currentTimeMs = value;
    }

    setText(value) {
        this._text = value;
    }

    updateElements() {
        this.updateWpmEl();
        this.updateAccuracyEl();
        this.updateTimeEl();
        this.updateTextToTypeEl();
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

    updateTextToTypeEl() {
        this._textToTypeEl.value = this._text;
    }

    start() {
        if (this._currentTimeMs !== "passage") {
            const frameRateMs = 13;
            let prevTimeMs = Date.now();
            this._intervalId = setInterval(() => {
                const passedMs = Date.now() - prevTimeMs;
                prevTimeMs = Date.now();
                this._currentTimeMs = Math.max(0, this._currentTimeMs - passedMs);
                this.updateTimeEl();
            }, frameRateMs)
        }
    }

    stop(){
        if (this._intervalId != null){
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }
}