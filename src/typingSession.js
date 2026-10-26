export class TypingSession{
    constructor(){
        this._wpm = 0;
        this._currentTimeSeconds = 0;
        this._text = "";
        this._wpmEl = null;
        this._accuracyEl = null;
        this._timeEl = null;
        this._textToTypeEl = null;
    }

    getAccuracy(){
        return 100;
    }

    setElements(
        wpmEl, 
        accuracyEl, 
        timeEl,
        textToTypeEl){
        this._wpmEl = wpmEl;
        this._accuracyEl = accuracyEl;
        this._timeEl = timeEl;
        this._textToTypeEl = textToTypeEl;
    }

    setCurrentTimeSeconds(value){
        this._currentTimeSeconds = value;
    }

    setText(value){
        this._text = value;
    }

    updateElements(){
        this.updateWpmEl();
        this.updateAccuracyEl();
        this.updateTimeEl();
        this.updateTextToTypeEl();
    }

    updateWpmEl(){
        this._wpmEl.textContent = this._wpm;
    }

    updateAccuracyEl(){
        this._accuracyEl.textContent = this.getAccuracy() + "%";
    }

    updateTimeEl(){
        if (this._currentTimeSeconds === "passage"){
           this._timeEl.textContent = "-"; 
        }
        else if(this._currentTimeSeconds === 60){
            this._timeEl.textContent = "00:60";
        }
        else{
            let seconds = this._currentTimeSeconds % 60;
            seconds = seconds > 9 ? seconds : `0${seconds}`;

            let minutes = Math.floor(this._currentTimeSeconds / 60);
            minutes = minutes > 9 ? minutes : `0${minutes}`;

            this._timeEl.textContent = `${minutes}:${seconds}`;
        }
    }

    updateTextToTypeEl(){
        this._textToTypeEl.value = this._text;
    }
}