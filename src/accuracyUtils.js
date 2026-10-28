import { COLOR_RED, COLOR_GREEN, COLOR_YELLOW } from "./colors.js";

export function getAccuracyColor(accuracy) {
    if (accuracy >= 100){
        return COLOR_GREEN;
    }
    else if (accuracy >= 97){
        return COLOR_YELLOW;
    }
    return COLOR_RED;
}