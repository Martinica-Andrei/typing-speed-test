import { $ } from "./querySelector.js";

const personalBestEl = $("#personal-best-text");
const logoEl = $("#logo");

export function addScreenResize(){
    update();
    addEventListener("resize", update);
}

function update(){
    const isDesktopValue = isDesktop();
    updatePersonalBest(isDesktopValue);
    updateLogo(isDesktopValue);
}

function updatePersonalBest(isDesktop){
    personalBestEl.textContent = isDesktop ? "Personal best:" : "Best:";
}

function updateLogo(isDesktop){
    logoEl.src = isDesktop ? "assets/images/logo-large.svg" : "assets/images/logo-small.svg";
}

function isDesktop(){
    return window.innerWidth >= 800;
}