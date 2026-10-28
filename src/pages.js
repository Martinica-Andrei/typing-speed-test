import { $ } from "./querySelector.js";

const statisticsEl = $("#statistics");
const optionsEl = $("#options");
const contentEl = $("#content");
const contentBottomEl = $("#content-bottom");
const testCompleteSectionEl = $("#test-complete-section");

export function displayMainPage(){
    statisticsEl.style.display = "";   
    optionsEl.style.display = "";   
    contentBottomEl.style.display = "";   
    testCompleteSectionEl.style.display = "none";
    contentEl.classList.add("content");
}

export function displayTestCompletePage(){
    statisticsEl.style.display = "none";   
    optionsEl.style.display = "none";   
    contentBottomEl.style.display = "none";   
    testCompleteSectionEl.style.display = "";
    contentEl.classList.remove("content");
}