import { loadData } from "./dataRepository.js";
const $ = document.querySelector.bind(document);

const textToTypeEl = $("#text-to-type");

const data = await loadData();

textToTypeEl.textContent = data.easy[0].text;
