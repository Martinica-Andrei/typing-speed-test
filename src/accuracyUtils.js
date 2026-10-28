const COLOR_RED = window.getComputedStyle(document.body).getPropertyValue('--red-500');
const COLOR_GREEN = window.getComputedStyle(document.body).getPropertyValue('--green-500');

export function getAccuracyColor(accuracy) {
    return accuracy >= 100 ? COLOR_GREEN : COLOR_RED;
}