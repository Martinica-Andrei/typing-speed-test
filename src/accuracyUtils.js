import { COLOR_RED, COLOR_GREEN } from "./colors.js";

export function getAccuracyColor(accuracy) {
    return accuracy >= 100 ? COLOR_GREEN : COLOR_RED;
}